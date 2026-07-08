from grid_parser import parse_text
from simulator import simulate

TRIVIAL = """
B G*
robot: 0 0 R
functions: F1=2
"""

SERPENTINE = """
B  B* B* G*
O* B* B* G*
O* B* B* B*
robot: 0 0 R
functions: F1=4
"""


def test_forward_collects_star_and_wins():
    level = parse_text(TRIVIAL)
    result = simulate(level, (((None, 'F'),),))
    assert result.win
    assert result.status == 'win'
    assert result.steps == 1


def test_forward_into_void_falls():
    level = parse_text(TRIVIAL)
    # Turn around and drive off the left edge.
    program = (((None, 'L'), (None, 'L'), (None, 'F')),)
    result = simulate(level, program)
    assert not result.win
    assert result.status == 'fell'


def test_color_condition_skips_on_other_color():
    level = parse_text(TRIVIAL)
    # [G]left on a B cell must be skipped, then fwd wins.
    program = ((('G', 'L'), (None, 'F')),)
    result = simulate(level, program)
    assert result.win
    assert any('skipped' in line for line in result.trace)


def test_matching_condition_fires():
    level = parse_text(TRIVIAL)
    # [B]left, [B]left, [B]fwd on a B cell: turns around and falls.
    program = ((('B', 'L'), ('B', 'L'), ('B', 'F')),)
    assert simulate(level, program).status == 'fell'


def test_step_limit_kills_infinite_loop():
    level = parse_text(TRIVIAL)
    # F1: left, call F1 — spins forever via tail recursion.
    program = (((None, 'L'), (None, 0)),)
    result = simulate(level, program, max_steps=500)
    assert not result.win
    assert result.status == 'step_limit'
    assert result.steps == 500


def test_non_tail_recursion_overflows_stack():
    level = parse_text(TRIVIAL)
    # F1: call F1, left — the call is not in tail position.
    program = (((None, 0), (None, 'L')),)
    result = simulate(level, program, max_depth=10)
    assert not result.win
    assert result.status == 'stack_overflow'


def test_program_can_run_out_of_instructions():
    level = parse_text(TRIVIAL)
    result = simulate(level, (((None, 'L'),),))
    assert not result.win
    assert result.status == 'out_of_instructions'


def test_star_under_robot_counts_as_collected():
    level = parse_text("""
B* G*
robot: 0 0 R
functions: F1=1
""")
    result = simulate(level, (((None, 'F'),),))
    assert result.win
    assert result.steps == 1


def test_call_runs_other_function():
    level = parse_text(TRIVIAL)
    # F1: call F2; F2: fwd
    program = (((None, 1),), ((None, 'F'),))
    result = simulate(level, program)
    assert result.win


def test_serpentine_handwritten_solution():
    level = parse_text(SERPENTINE)
    # The classic single-function serpentine program.
    program = (((None, 'F'), ('G', 'R'), ('O', 'L'), (None, 0)),)
    result = simulate(level, program)
    assert result.win
    assert result.steps < 100


def test_tail_call_keeps_stack_flat():
    level = parse_text(SERPENTINE)
    program = (((None, 'F'), ('G', 'R'), ('O', 'L'), (None, 0)),)
    # With tail-call handling, depth 3 is plenty for the whole run.
    result = simulate(level, program, max_depth=3)
    assert result.win
