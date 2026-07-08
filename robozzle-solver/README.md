# robozzle-solver

A solver for RoboZZle-style robot programming puzzles (the kind used in
the École 42 admission game "Évaluation #4").

## The puzzle

A robot sits on a rectangular grid of colored cells (**B**lue,
**G**reen, **O**range); missing cells are void. Entering a cell
collects its star; collecting every star wins, driving into the void
loses. You program the robot with functions F1..Fn of limited size,
using four instructions — `fwd`, `left`, `right`, `call Fk` — each with
an optional color condition (`[G]right` only fires on a green cell).
Execution starts at F1 and recursion is the intended way to loop.

## Usage

```sh
python main.py levels/serpentine.txt
```

prints the level, the smallest program found, and a step-by-step trace:

```
Solution (4 instruction(s)):
F1: fwd, [O]left, [G]right, call F1

Trace:
start at (0, 0) facing R; 11 star(s) to collect
   1. F1[0] fwd            moved to (0, 1), collected a star (10 left)
   2. F1[1] [O]left        skipped (cell is B)
   ...
```

Options: `--max-total N` caps total instruction count, `--search-steps N`
raises the per-candidate execution cap for levels with long solutions,
`--fast` is an incomplete but quicker search mode, `--no-trace` skips
the trace.

### Level file format

```
B* G* G* O*     # one row per line: B/G/O cells, '*' = star, '.' = void
B* G  G* O*
robot: 1 0 R    # 0-based ROW COL and direction U/D/L/R
functions: F1=4 F2=4 F3=4   # slot limit per function
```

### Screenshot input (experimental)

```sh
pip install pillow numpy
python main.py --image screenshot.png [--rows 3 --cols 4]
```

`image_parser.py` finds the grid region, classifies each cell's hue,
detects stars (near-white centers) and guesses the robot triangle and
its facing. The parsed grid is **printed for you to verify and is never
solved unconfirmed** — fix anything that's wrong (especially the
placeholder `functions:` line, which cannot be read from a picture),
save it as a text file and solve that.

## How the solver works

`solver.py` runs **iterative deepening** on the number of placed
instructions, so the first program found is minimal. Each iteration is
a DFS that *simulates while it synthesizes*: the program starts empty
and instructions are only chosen at the moment the robot's execution
actually fetches the empty slot. That single idea buys most of the
pruning:

- **no unreachable code** — every placed instruction is fetched at
  least once by construction;
- **bad prefixes die early** — a program whose beginning drives into
  the void is abandoned before the rest is ever generated;
- **loop cutting** — along each search path the machine states
  (position, direction, stars left, call stack) are memoized; execution
  is deterministic, so a repeated state is a proven infinite loop and
  the branch is cut immediately;
- **canonical ordering** — `call F3` is only tried once F2 is already
  referenced, collapsing programs that differ only by a permutation of
  the helper functions; a reached slot may also be "sealed" (function
  ends there), which is what lets calls return to their caller.

`simulator.py` is an independent, dumb re-implementation of the rules
(explicit call stack, tail calls, 10 000-step cap) used to verify every
solution and to produce the printed trace.

## Tests

```sh
python -m pytest
```

34 tests cover the simulator semantics (falling, conditions, tail
calls, stack overflow, step limit), the parser (including error cases),
the solver on solvable and provably unsolvable levels, and the image
parser on synthetic screenshots.
