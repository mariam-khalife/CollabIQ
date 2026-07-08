import pytest

from grid_parser import GridParseError, level_to_text, parse_text

SAMPLE = """
# a comment
B* G* G* O*
B* G  G* O*
robot: 1 0 R
functions: F1=4 F2=4 F3=4
"""


def test_parse_sample():
    level = parse_text(SAMPLE)
    assert (level.width, level.height) == (4, 2)
    assert level.colors[(0, 0)] == 'B'
    assert level.colors[(1, 1)] == 'G'
    assert (1, 1) not in level.stars
    assert (0, 1) in level.stars
    assert len(level.stars) == 7
    assert level.robot == (1, 0, 'R')
    assert level.func_slots == (4, 4, 4)


def test_void_cells_are_absent():
    level = parse_text("""
B* . B*
robot: 0 0 R
functions: F1=2
""")
    assert (0, 1) not in level.colors
    assert level.width == 3


def test_roundtrip_through_text():
    level = parse_text(SAMPLE)
    again = parse_text(level_to_text(level))
    assert again == level


@pytest.mark.parametrize('bad, msg', [
    ('B*\nfunctions: F1=2', 'robot'),
    ('B*\nrobot: 0 0 R', 'functions'),
    ('B* X\nrobot: 0 0 R\nfunctions: F1=2', 'bad cell'),
    ('B* G\nB*\nrobot: 0 0 R\nfunctions: F1=2', 'same width'),
    ('B* G\nrobot: 0 1 Z\nfunctions: F1=2', 'direction'),
    ('B* G\nrobot: 0 0 R\nfunctions: F2=2', 'expected F1'),
    ('. B*\nrobot: 0 0 R\nfunctions: F1=2', 'not on a colored cell'),
    ('B G\nrobot: 0 0 R\nfunctions: F1=2', 'no stars'),
])
def test_parse_errors(bad, msg):
    with pytest.raises(GridParseError, match=msg):
        parse_text(bad)
