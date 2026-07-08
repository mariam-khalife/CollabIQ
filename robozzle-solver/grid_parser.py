"""Parse text descriptions of RoboZZle-style levels.

Format (whitespace-separated cell tokens, one grid row per line):

    B* G* G* O*
    B* G  G* O*
    robot: 1 0 R
    functions: F1=4 F2=4 F3=4

Cell tokens: a color letter B/G/O, optionally followed by '*' for a
star, or '.' for void. The robot line is `robot: ROW COL DIR` with
0-based row/column counted from the top-left and DIR one of U/D/L/R.
The functions line lists the maximum slot count of each function, in
order F1, F2, ... Everything after '#' on a line is a comment.
"""

import re

from simulator import Level

_CELL_RE = re.compile(r'([BGO])(\*?)\Z')
_FUNC_RE = re.compile(r'[Ff](\d+)=(\d+)\Z')


class GridParseError(ValueError):
    pass


def parse_text(text):
    grid_rows = []   # (lineno, [(color-or-None, has_star), ...])
    robot = None
    slots = None

    for lineno, raw in enumerate(text.splitlines(), 1):
        line = raw.split('#', 1)[0].strip()
        if not line:
            continue
        low = line.lower()
        if low.startswith('robot:'):
            if robot is not None:
                raise GridParseError(f'line {lineno}: duplicate robot line')
            parts = line.split(':', 1)[1].split()
            if len(parts) != 3:
                raise GridParseError(
                    f"line {lineno}: expected 'robot: ROW COL DIR', got {line!r}")
            try:
                r, c = int(parts[0]), int(parts[1])
            except ValueError:
                raise GridParseError(
                    f'line {lineno}: robot row/col must be integers') from None
            d = parts[2].upper()
            if d not in ('U', 'D', 'L', 'R'):
                raise GridParseError(
                    f'line {lineno}: robot direction must be U, D, L or R')
            robot = (r, c, d)
        elif low.startswith('functions:'):
            if slots is not None:
                raise GridParseError(f'line {lineno}: duplicate functions line')
            slots = []
            for k, tok in enumerate(line.split(':', 1)[1].split(), 1):
                m = _FUNC_RE.match(tok)
                if not m or int(m.group(1)) != k:
                    raise GridParseError(
                        f'line {lineno}: expected F{k}=N, got {tok!r}')
                n = int(m.group(2))
                if n < 1:
                    raise GridParseError(
                        f'line {lineno}: F{k} must have at least 1 slot')
                slots.append(n)
            if not slots:
                raise GridParseError(f'line {lineno}: functions line is empty')
        else:
            row = []
            for tok in line.split():
                if tok == '.':
                    row.append((None, False))
                    continue
                m = _CELL_RE.match(tok.upper())
                if not m:
                    raise GridParseError(
                        f'line {lineno}: bad cell token {tok!r} '
                        "(expected B, G, O, optionally with '*', or '.')")
                row.append((m.group(1), m.group(2) == '*'))
            grid_rows.append((lineno, row))

    if not grid_rows:
        raise GridParseError('no grid rows found')
    width = len(grid_rows[0][1])
    colors = {}
    stars = set()
    for r, (lineno, row) in enumerate(grid_rows):
        if len(row) != width:
            raise GridParseError(
                f'line {lineno}: expected {width} cells, got {len(row)} '
                '(all rows must have the same width)')
        for c, (color, has_star) in enumerate(row):
            if color:
                colors[(r, c)] = color
            if has_star:
                stars.add((r, c))

    if robot is None:
        raise GridParseError("missing 'robot: ROW COL DIR' line")
    if slots is None:
        raise GridParseError("missing 'functions: F1=N ...' line")
    if robot[:2] not in colors:
        raise GridParseError(f'robot at {robot[:2]} is not on a colored cell')
    if not stars:
        raise GridParseError('level has no stars')

    return Level(width=width, height=len(grid_rows), colors=colors,
                 stars=frozenset(stars), robot=robot, func_slots=tuple(slots))


def parse_file(path):
    with open(path, encoding='utf-8') as fh:
        return parse_text(fh.read())


def level_to_text(level):
    lines = []
    for r in range(level.height):
        toks = []
        for c in range(level.width):
            color = level.colors.get((r, c))
            if color is None:
                toks.append('. ')
            else:
                toks.append(color + ('*' if (r, c) in level.stars else ' '))
        lines.append(' '.join(toks).rstrip())
    lines.append(f'robot: {level.robot[0]} {level.robot[1]} {level.robot[2]}')
    lines.append('functions: '
                 + ' '.join(f'F{i + 1}={n}' for i, n in enumerate(level.func_slots)))
    return '\n'.join(lines) + '\n'
