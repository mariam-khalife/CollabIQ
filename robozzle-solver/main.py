#!/usr/bin/env python3
"""Solve a RoboZZle-style level from a text file (or a screenshot).

Examples:
    python main.py levels/serpentine.txt
    python main.py --image screenshot.png --rows 3 --cols 4
"""

import argparse
import sys

from grid_parser import GridParseError, level_to_text, parse_file, parse_text
from simulator import format_program, simulate
from solver import solve


def image_flow(args):
    """Parse a screenshot and make the user confirm the result.

    Never solves straight from unverified image parsing: the grid is
    printed and must be confirmed (interactively, or via --yes only
    after a previous run has been checked).
    """
    try:
        from image_parser import parse_image
    except ImportError:
        sys.exit('image mode needs Pillow and numpy: pip install pillow numpy')

    try:
        text, warnings = parse_image(args.image, rows=args.rows, cols=args.cols)
    except ValueError as e:
        sys.exit(f'image parse failed: {e}')

    print('Grid parsed from the image — PLEASE VERIFY, image parsing is best-effort:\n')
    print(text)
    for w in warnings:
        print(f'warning: {w}')

    if args.yes:
        return text
    if not sys.stdin.isatty():
        sys.exit('\nNot solving: the parsed grid is unconfirmed. Check it, then '
                 'either re-run with --yes or save the (corrected) text to a '
                 'file and run: python main.py LEVELFILE')
    ans = input('\nSolve this grid as printed? [y/N] ').strip().lower()
    if ans not in ('y', 'yes'):
        print('Not solving. Save the printed grid to a file, correct it, then '
              'run: python main.py LEVELFILE')
        sys.exit(1)
    return text


def main(argv=None):
    ap = argparse.ArgumentParser(
        description='Solver for RoboZZle-style robot programming puzzles.')
    ap.add_argument('level', nargs='?', help='level text file')
    ap.add_argument('--image', metavar='PNG',
                    help='parse a screenshot instead of a text file '
                         '(requires Pillow + numpy; result must be confirmed)')
    ap.add_argument('--rows', type=int, help='grid row count (image mode)')
    ap.add_argument('--cols', type=int, help='grid column count (image mode)')
    ap.add_argument('--yes', action='store_true',
                    help='image mode: accept the parsed grid without prompting '
                         '(only use after verifying a previous run)')
    ap.add_argument('--max-total', type=int, default=None,
                    help='cap on total placed instructions (default: all slots)')
    ap.add_argument('--search-steps', type=int, default=1500,
                    help='execution step cap per candidate during search')
    ap.add_argument('--fast', action='store_true',
                    help='incomplete but faster search: every instruction must '
                         'fire the first time it is fetched (may miss solutions)')
    ap.add_argument('--no-trace', action='store_true',
                    help='do not print the step-by-step trace')
    args = ap.parse_args(argv)

    if bool(args.level) == bool(args.image):
        ap.error('give exactly one of LEVEL or --image')

    if args.image:
        text = image_flow(args)
    else:
        try:
            with open(args.level, encoding='utf-8') as fh:
                text = fh.read()
        except OSError as e:
            sys.exit(str(e))

    try:
        level = parse_text(text)
    except GridParseError as e:
        sys.exit(f'parse error: {e}')

    print('Level:')
    print(level_to_text(level))
    print('Searching...')
    program = solve(level, max_total=args.max_total,
                    search_steps=args.search_steps,
                    first_fire_only=args.fast)
    if program is None:
        print('No solution found within the limits.')
        if args.fast:
            print('--fast is an incomplete search: retry without it.')
        else:
            print('You can retry with a higher --search-steps; if that also '
                  'fails, the level has no solution with these function sizes.')
        return 1

    n = sum(len(func) for func in program)
    print(f'\nSolution ({n} instruction(s)):')
    print(format_program(program))

    result = simulate(level, program)
    if not args.no_trace:
        print('\nTrace:')
        print('\n'.join(result.trace))
    print(f'\nresult: {result.status} after {result.steps} step(s)')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
