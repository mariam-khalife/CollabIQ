import pytest

np = pytest.importorskip('numpy')
pytest.importorskip('PIL')

from PIL import Image

from grid_parser import parse_text
from image_parser import parse_image

CELL = 40
LINE = 6
PALETTE = {'B': (45, 90, 220), 'G': (50, 190, 70), 'O': (245, 150, 40)}


def make_screenshot(path, layout, stars, robot_cell):
    """Draw a synthetic puzzle screenshot: colored cells on a dark
    background with grid lines, white star squares, and a gray triangle
    robot pointing right."""
    rows, cols = len(layout), len(layout[0])
    h = rows * CELL + (rows + 1) * LINE
    w = cols * CELL + (cols + 1) * LINE
    img = np.full((h, w, 3), 15, np.uint8)
    for r in range(rows):
        for c in range(cols):
            color = layout[r][c]
            if color == '.':
                continue
            y = LINE + r * (CELL + LINE)
            x = LINE + c * (CELL + LINE)
            img[y:y + CELL, x:x + CELL] = PALETTE[color]
            if (r, c) in stars:
                cy, cx = y + CELL // 2, x + CELL // 2
                img[cy - 5:cy + 5, cx - 5:cx + 5] = (250, 250, 250)
            if (r, c) == robot_cell:
                # 20x20 isoceles triangle pointing right, centered.
                ty, tx = y + CELL // 2, x + CELL // 2 - 10
                for dx in range(20):
                    half = max(1, (20 - dx) // 2)
                    img[ty - half:ty + half, tx + dx] = (120, 120, 120)
    Image.fromarray(img).save(path)


def test_synthetic_screenshot_roundtrip(tmp_path):
    path = tmp_path / 'shot.png'
    layout = ['BGO', 'G.B']
    make_screenshot(path, layout, stars={(0, 1), (1, 2)}, robot_cell=(0, 0))

    text, warnings = parse_image(str(path))
    level = parse_text(text)

    assert (level.height, level.width) == (2, 3)
    assert level.colors[(0, 0)] == 'B'
    assert level.colors[(0, 1)] == 'G'
    assert level.colors[(0, 2)] == 'O'
    assert level.colors[(1, 0)] == 'G'
    assert (1, 1) not in level.colors
    assert level.colors[(1, 2)] == 'B'
    assert level.stars == frozenset({(0, 1), (1, 2)})
    assert level.robot == (0, 0, 'R')
    # The placeholder functions line must be flagged for editing.
    assert any('slot counts' in w for w in warnings)


def test_explicit_rows_cols_override(tmp_path):
    path = tmp_path / 'shot.png'
    make_screenshot(path, ['BB', 'BB'], stars={(1, 1)}, robot_cell=(0, 0))
    text, _ = parse_image(str(path), rows=2, cols=2)
    level = parse_text(text)
    assert (level.height, level.width) == (2, 2)
    assert level.stars == frozenset({(1, 1)})


def test_blank_image_raises(tmp_path):
    path = tmp_path / 'blank.png'
    Image.fromarray(np.full((100, 100, 3), 15, np.uint8)).save(path)
    with pytest.raises(ValueError):
        parse_image(str(path))
