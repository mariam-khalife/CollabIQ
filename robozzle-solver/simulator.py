"""Simulator for RoboZZle-style robot programming puzzles.

A level is a rectangular grid of colored cells ('B', 'G', 'O'); missing
cells are void. The robot starts on a colored cell facing U/D/L/R.
Entering a cell collects its star; collecting every star wins. Driving
onto void (or off the grid) loses.

A program is a sequence of functions F1..Fn; each function is a sequence
of instructions. An instruction is a (condition, op) pair:

    condition: None (always execute) or one of 'B', 'G', 'O'
               (execute only when the robot's cell has that color)
    op:        'F' (forward), 'L' (turn left), 'R' (turn right),
               or an int k meaning "call function k" (0-based, so 0 = F1)

Execution starts at F1[0] and runs on an explicit call stack, so
recursion is allowed (and usually required). A call placed in the last
occupied slot of a function is a tail call: the caller's frame is
dropped before the callee is pushed, so `F1: ..., call F1` loops with
constant stack depth. Empty slots (None) are no-ops.

Every fetched instruction counts as one step, including instructions
skipped because their color condition does not match; the step limit
therefore kills every infinite loop.
"""

from dataclasses import dataclass

COLORS = ('B', 'G', 'O')

DELTA = {'U': (-1, 0), 'D': (1, 0), 'L': (0, -1), 'R': (0, 1)}
LEFT_OF = {'U': 'L', 'L': 'D', 'D': 'R', 'R': 'U'}
RIGHT_OF = {v: k for k, v in LEFT_OF.items()}


@dataclass(frozen=True)
class Level:
    width: int
    height: int
    colors: dict        # (row, col) -> 'B' | 'G' | 'O'; absent key = void
    stars: frozenset    # {(row, col), ...}
    robot: tuple        # (row, col, direction)
    func_slots: tuple   # max slot count per function, e.g. (4, 4, 4)


@dataclass
class Result:
    win: bool
    status: str   # 'win' | 'fell' | 'out_of_instructions' | 'step_limit' | 'stack_overflow'
    steps: int
    trace: list   # human-readable lines, one per event


def format_instruction(instr):
    if instr is None:
        return '(nop)'
    cond, op = instr
    prefix = f'[{cond}]' if cond else ''
    if op == 'F':
        body = 'fwd'
    elif op == 'L':
        body = 'left'
    elif op == 'R':
        body = 'right'
    else:
        body = f'call F{op + 1}'
    return prefix + body


def format_program(program):
    lines = []
    for fi, func in enumerate(program):
        body = ', '.join(format_instruction(ins) for ins in func) or '(empty)'
        lines.append(f'F{fi + 1}: {body}')
    return '\n'.join(lines)


def simulate(level, program, max_steps=10_000, max_depth=1_000, want_trace=True):
    """Run `program` on `level`; return a Result.

    The trace records every executed (or condition-skipped) instruction
    with the robot's position/direction so a solution can be verified by
    eye. Pass want_trace=False to skip building it.
    """
    row, col, direction = level.robot
    pos = (row, col)
    stars = set(level.stars)
    stars.discard(pos)  # standing on a star collects it

    trace = []

    def note(msg):
        if want_trace:
            trace.append(msg)

    note(f'start at {pos} facing {direction}; {len(stars)} star(s) to collect')
    if not stars:
        note('no stars left to collect: instant win')
        return Result(True, 'win', 0, trace)

    stack = [[0, 0]]  # frames of [function index, next slot index]
    steps = 0
    while stack:
        f, i = stack[-1]
        func = program[f]
        if i >= len(func):
            stack.pop()
            continue
        stack[-1][1] += 1
        if stack[-1][1] >= len(func):
            stack.pop()  # nothing left in this frame -> calls become tail calls
        instr = func[i]
        if instr is None:  # empty slot
            continue
        steps += 1
        if steps > max_steps:
            note(f'step limit of {max_steps} exceeded: assuming infinite loop')
            return Result(False, 'step_limit', max_steps, trace)
        cond, op = instr
        color = level.colors[pos]
        label = f'{steps:4d}. F{f + 1}[{i}] {format_instruction(instr):<14}'
        if cond is not None and cond != color:
            note(f'{label} skipped (cell is {color})')
            continue
        if op == 'L':
            direction = LEFT_OF[direction]
            note(f'{label} now facing {direction}')
        elif op == 'R':
            direction = RIGHT_OF[direction]
            note(f'{label} now facing {direction}')
        elif op == 'F':
            dr, dc = DELTA[direction]
            pos = (pos[0] + dr, pos[1] + dc)
            if pos not in level.colors:
                note(f'{label} moved to {pos}: void! the robot falls')
                return Result(False, 'fell', steps, trace)
            if pos in stars:
                stars.remove(pos)
                note(f'{label} moved to {pos}, collected a star ({len(stars)} left)')
                if not stars:
                    note('all stars collected: WIN')
                    return Result(True, 'win', steps, trace)
            else:
                note(f'{label} moved to {pos}')
        else:  # call
            if len(stack) >= max_depth:
                note(f'{label} would exceed call-stack depth {max_depth}')
                return Result(False, 'stack_overflow', steps, trace)
            stack.append([op, 0])
            note(f'{label} entering F{op + 1}')

    note(f'program finished with {len(stars)} star(s) uncollected')
    return Result(False, 'out_of_instructions', steps, trace)
