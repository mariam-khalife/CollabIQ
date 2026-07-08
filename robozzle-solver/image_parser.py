"""Best-effort screenshot -> level text for RoboZZle-style puzzles.

The output is meant to be *verified by a human* before solving: cell
colors, stars and especially the robot are detected heuristically and
screenshots vary a lot. main.py enforces a confirmation step.

Pipeline:
  1. find the grid region as the bounding box of saturated pixels;
  2. count rows/columns from the runs of colored pixels separated by
     grid lines (or take --rows/--cols overrides);
  3. classify each cell's dominant hue (blue/green/orange, else void);
  4. a star is a patch of near-white pixels in the cell center;
  5. the robot is the cell with the most gray (low-saturation,
     mid-brightness) pixels — its triangle's tip, the gray pixel
     farthest from the gray centroid, gives the facing direction.

Function slot counts cannot be read from the grid, so a placeholder
functions line is emitted that the user must edit.
"""

import numpy as np
from PIL import Image

_SAT_MIN = 35        # max-min channel spread for a pixel to count as colored
_VAL_MIN = 60        # brightness floor for colored pixels
_CELL_COLORED_MIN = 0.20   # colored fraction for a cell to be non-void
_STAR_WHITE_MIN = 0.03     # near-white fraction in cell center to call a star
_ROBOT_GRAY_MIN = 0.06     # gray fraction in cell center to call the robot


def _hue(r, g, b):
    mx, mn = max(r, g, b), min(r, g, b)
    d = mx - mn
    if d == 0:
        return None
    if mx == r:
        return (60 * (g - b) / d) % 360
    if mx == g:
        return 60 * (b - r) / d + 120
    return 60 * (r - g) / d + 240


def _classify(rgb):
    r, g, b = (int(x) for x in rgb)
    if max(r, g, b) < _VAL_MIN or max(r, g, b) - min(r, g, b) < _SAT_MIN:
        return None
    h = _hue(r, g, b)
    if h is None:
        return None
    if h < 70 or h >= 330:   # orange through red
        return 'O'
    if h < 170:
        return 'G'
    if h < 290:
        return 'B'
    return None


def _count_cells(profile):
    """Count cells along one axis from a colored-pixel-fraction profile.

    Cells appear as runs of high fraction separated by grid-line dips.
    The threshold is low because a line of cells may be mostly void.
    """
    inside = profile > profile.max() * 0.2
    runs = []
    length = 0
    for v in inside:
        if v:
            length += 1
        elif length:
            runs.append(length)
            length = 0
    if length:
        runs.append(length)
    min_len = max(3, int(len(profile) * 0.02))
    return len([r for r in runs if r >= min_len])


def _robot_direction(cell):
    """Facing of the triangle drawn in gray inside `cell` (H, W, 3)."""
    mx = cell.max(axis=2)
    mn = cell.min(axis=2)
    gray = ((mx - mn) < _SAT_MIN) & (mx > _VAL_MIN) & (mx < 230)
    ys, xs = np.nonzero(gray)
    if ys.size < 10:
        return None
    cy, cx = ys.mean(), xs.mean()
    # The tip is the gray pixel farthest from the blob centroid.
    k = ((ys - cy) ** 2 + (xs - cx) ** 2).argmax()
    vy, vx = ys[k] - cy, xs[k] - cx
    if abs(vy) >= abs(vx):
        return 'D' if vy > 0 else 'U'
    return 'R' if vx > 0 else 'L'


def parse_image(path, rows=None, cols=None):
    """Return (level_text, warnings) parsed from the screenshot at `path`.

    Raises ValueError when no grid can be found. The text always needs
    human review; the emitted functions line is a placeholder.
    """
    warnings = []
    arr = np.asarray(Image.open(path).convert('RGB')).astype(np.int32)
    mx = arr.max(axis=2)
    mn = arr.min(axis=2)
    colored = ((mx - mn) > _SAT_MIN) & (mx > _VAL_MIN)

    ys = np.where(colored.mean(axis=1) > 0.02)[0]
    xs = np.where(colored.mean(axis=0) > 0.02)[0]
    if ys.size == 0 or xs.size == 0:
        raise ValueError('no colored grid region detected in the image')
    y0, y1 = int(ys[0]), int(ys[-1]) + 1
    x0, x1 = int(xs[0]), int(xs[-1]) + 1

    sub = colored[y0:y1, x0:x1]
    if rows is None:
        rows = _count_cells(sub.mean(axis=1))
    if cols is None:
        cols = _count_cells(sub.mean(axis=0))
    if rows < 1 or cols < 1:
        raise ValueError('could not autodetect the cell grid; pass rows/cols')

    cell_h = (y1 - y0) / rows
    cell_w = (x1 - x0) / cols

    grid = []
    robot = None
    robot_dir = None
    best_gray = 0.0
    for r in range(rows):
        row_tokens = []
        for c in range(cols):
            cy0, cy1 = y0 + int(r * cell_h), y0 + int((r + 1) * cell_h)
            cx0, cx1 = x0 + int(c * cell_w), x0 + int((c + 1) * cell_w)
            ch, cw = cy1 - cy0, cx1 - cx0
            # Sample the central 60% so grid lines and neighbors don't bleed in.
            core = arr[cy0 + ch * 2 // 10: cy1 - ch * 2 // 10,
                       cx0 + cw * 2 // 10: cx1 - cw * 2 // 10].reshape(-1, 3)
            pmx = core.max(axis=1)
            pmn = core.min(axis=1)
            is_colored = ((pmx - pmn) > _SAT_MIN) & (pmx > _VAL_MIN)
            color = None
            if core.size and is_colored.mean() >= _CELL_COLORED_MIN:
                color = _classify(np.median(core[is_colored], axis=0))
            if color is None:
                row_tokens.append('.')
                continue

            star = (pmn > 190).mean() > _STAR_WHITE_MIN
            row_tokens.append(color + ('*' if star else ''))

            gray_frac = (((pmx - pmn) < _SAT_MIN)
                         & (pmx > _VAL_MIN) & (pmx < 230)).mean()
            if gray_frac > _ROBOT_GRAY_MIN and gray_frac > best_gray:
                best_gray = gray_frac
                robot = (r, c)
                robot_dir = _robot_direction(arr[cy0:cy1, cx0:cx1])
        grid.append(' '.join(f'{t:<2}' for t in row_tokens).rstrip())

    lines = list(grid)
    if robot and robot_dir:
        lines.append(f'robot: {robot[0]} {robot[1]} {robot_dir}')
        warnings.append(f'robot guessed at row {robot[0]}, col {robot[1]} '
                        f'facing {robot_dir} — double-check it')
    else:
        lines.append('# robot: ROW COL DIR   <- EDIT: robot was not detected')
        warnings.append("robot not detected — add a 'robot: ROW COL DIR' "
                        'line by hand')
    lines.append('functions: F1=5 F2=5   # EDIT: slot counts are a placeholder')
    warnings.append('function slot counts cannot be read from a screenshot — '
                    'set them to match the puzzle')
    return '\n'.join(lines) + '\n', warnings
