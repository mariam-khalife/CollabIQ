from grid_parser import parse_text
from simulator import simulate
from solver import solve


def check_solution(level, program):
    """A solution must win and must respect the level's slot limits."""
    assert program is not None, 'expected a solution'
    assert len(program) == len(level.func_slots)
    for func, limit in zip(program, level.func_slots):
        assert len(func) <= limit
    result = simulate(level, program)
    assert result.win, f'solver returned a losing program: {result.status}'
    return program


def total_instructions(program):
    return sum(len(func) for func in program)


def test_trivial_one_row_level():
    level = parse_text("""
B G*
robot: 0 0 R
functions: F1=2
""")
    program = check_solution(level, solve(level))
    assert total_instructions(program) == 1  # just: fwd


def test_trivial_level_with_longer_row():
    level = parse_text("""
B G G B*
robot: 0 0 R
functions: F1=3
""")
    program = check_solution(level, solve(level))
    # Minimal is 2 instructions (e.g. fwd, call F1).
    assert total_instructions(program) == 2


def test_serpentine_single_function():
    level = parse_text("""
B  B* B* G*
O* B* B* G*
O* B* B* B*
robot: 0 0 R
functions: F1=4
""")
    program = check_solution(level, solve(level))
    assert total_instructions(program) <= 4
    assert len(program[0]) <= 4


def test_two_functions_get_used():
    # Straight run to the right, but F1 only has 2 slots, so the
    # solver must recurse (fwd, call F1) or route through F2.
    level = parse_text("""
B G G G G B*
robot: 0 0 R
functions: F1=2 F2=2
""")
    check_solution(level, solve(level))


def test_no_solution_star_unreachable():
    level = parse_text("""
B* . G*
robot: 0 0 R
functions: F1=3
""")
    assert solve(level) is None


def test_no_solution_not_enough_slots():
    # 5 forwards needed but only 1 slot and recursion is impossible
    # to shorten below 2 instructions (fwd + call).
    level = parse_text("""
B G G G G B*
robot: 0 0 R
functions: F1=1
""")
    assert solve(level) is None


def test_star_only_under_robot_is_instant_win():
    level = parse_text("""
B* G
robot: 0 0 R
functions: F1=1
""")
    program = solve(level)
    assert program is not None
    assert total_instructions(program) == 0


def test_fast_mode_solves_unconditional_levels():
    level = parse_text("""
B G G G G B*
robot: 0 0 R
functions: F1=2
""")
    check_solution(level, solve(level, first_fire_only=True))


def test_solver_finds_conditional_turns():
    # A corner: must turn exactly at the G cell, so a color condition
    # (or a counted turn) is required within the 3-slot function.
    level = parse_text("""
B B B G
.  . . B*
robot: 0 0 R
functions: F1=3
""")
    check_solution(level, solve(level))
