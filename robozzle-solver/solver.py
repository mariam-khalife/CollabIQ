"""Search for programs that solve RoboZZle-style levels.

Strategy
--------
Iterative deepening on the number of placed instructions: try to win
with 1 instruction, then 2, ... up to the total slot budget, so the
first program found is minimal in instruction count.

Each iteration runs a DFS that *simulates while it synthesizes*: the
program starts out empty and the robot is simulated from the start
state; only when execution actually reaches an empty slot do we branch
over the instructions that could go there. This buys several prunings
at once:

* every placed instruction is executed at least once, so programs with
  unreachable/dead instructions are never generated;
* a bad prefix dies the moment the robot falls off the grid — no time
  is wasted completing programs whose beginning is already fatal;
* the machine state (position, direction, stars left, call stack) is
  memoized along each search path, so a repeated (state, program
  counter) pair — a guaranteed infinite loop, since execution is
  deterministic — is cut immediately instead of running to the step cap;
* canonical function ordering: `call Fk` is only tried once every
  function below k is already referenced, so programs identical up to a
  permutation of F2/F3/... are explored once.

When execution reaches an empty slot it may, instead of placing an
instruction, *seal* the rest of the function (making it shorter). This
costs no budget and is what lets a call return to its caller.

Conditions are drawn from the colors actually present in the level.
With first_fire_only=True the search additionally requires each placed
instruction to fire the first time it is fetched (condition None or the
color the robot is standing on). That is a big speedup but incomplete:
the classic `fwd, [G]right, [O]left, call F1` serpentine program needs
conditions that are skipped on their first pass, so use it only as a
quick first attempt on big levels.
"""

from simulator import COLORS, DELTA, LEFT_OF, RIGHT_OF, simulate

# Marks "this slot and everything after it in the function is empty".
SEAL = object()


class _State:
    __slots__ = ('pos', 'direction', 'stars', 'stack', 'steps', 'seen')

    def __init__(self, pos, direction, stars, stack, steps, seen):
        self.pos = pos
        self.direction = direction
        self.stars = stars          # frozenset, replaced on collect
        self.stack = stack          # list of [function index, next slot]
        self.steps = steps
        self.seen = seen            # signatures visited on this path

    def copy(self):
        return _State(self.pos, self.direction, self.stars,
                      [frame[:] for frame in self.stack],
                      self.steps, set(self.seen))

    def signature(self):
        return (self.pos, self.direction, self.stars,
                tuple(map(tuple, self.stack)))


class _Search:
    def __init__(self, level, budget, search_steps, max_depth, first_fire_only):
        self.level = level
        self.program = [[None] * n for n in level.func_slots]
        self.nfuncs = len(level.func_slots)
        self.budget = budget
        self.search_steps = search_steps
        self.max_depth = max_depth
        self.first_fire_only = first_fire_only
        # Only colors that exist in the level make useful conditions.
        self.conds = (None,) + tuple(c for c in COLORS
                                     if c in set(level.colors.values()))

    def run(self, st, filled, highest):
        """Continue simulating; branch when an empty slot is reached.

        Returns a completed program (tuple of tuples) on win, else None.
        `filled` counts placed instructions, `highest` is the highest
        function index referenced so far (for canonical call ordering).
        """
        prog = self.program
        while True:
            if not st.stack:
                return None  # program ended with stars left
            f, i = st.stack[-1]
            if i >= len(prog[f]):
                st.stack.pop()
                continue
            instr = prog[f][i]
            if instr is SEAL:
                st.stack.pop()
                continue
            if instr is not None:
                r = self.step(st, instr, f)
                if r == 'win':
                    return self.snapshot()
                if not r:
                    return None
                continue

            # Execution reached an empty slot: decide what goes there.
            if filled < self.budget:
                for cand in self.candidates(st, highest):
                    prog[f][i] = cand
                    branch = st.copy()
                    r = self.step(branch, cand, f)
                    if r == 'win':
                        sol = self.snapshot()
                        prog[f][i] = None
                        return sol
                    if r:
                        op = cand[1]
                        nh = max(highest, op) if isinstance(op, int) else highest
                        sol = self.run(branch, filled + 1, nh)
                        if sol is not None:
                            prog[f][i] = None
                            return sol
                    prog[f][i] = None
            # ... or leave the rest of this function empty. Sealing at
            # slot 0 would make an empty function, equivalent to a
            # shorter program already tried in an earlier iteration.
            if i > 0:
                prog[f][i] = SEAL
                branch = st.copy()
                branch.stack.pop()
                sol = self.run(branch, filled, highest)
                prog[f][i] = None
                if sol is not None:
                    return sol
            return None

    def step(self, st, instr, f):
        """Execute one instruction, mutating st.

        Returns 'win', True (keep going) or False (dead branch).
        """
        top = st.stack[-1]
        top[1] += 1
        if top[1] >= len(self.program[f]):
            st.stack.pop()  # tail-call: frame has nothing left
        st.steps += 1
        if st.steps > self.search_steps:
            return False
        cond, op = instr
        if cond is None or cond == self.level.colors[st.pos]:
            if op == 'L':
                st.direction = LEFT_OF[st.direction]
            elif op == 'R':
                st.direction = RIGHT_OF[st.direction]
            elif op == 'F':
                dr, dc = DELTA[st.direction]
                npos = (st.pos[0] + dr, st.pos[1] + dc)
                if npos not in self.level.colors:
                    return False  # fell into void
                st.pos = npos
                if npos in st.stars:
                    st.stars = st.stars - {npos}
                    if not st.stars:
                        return 'win'
            else:  # call
                if len(st.stack) >= self.max_depth:
                    return False
                st.stack.append([op, 0])
        sig = st.signature()
        if sig in st.seen:
            return False  # deterministic machine revisited a state: loop
        st.seen.add(sig)
        return True

    def candidates(self, st, highest):
        """Instructions worth trying in the slot execution just reached."""
        color = self.level.colors[st.pos]
        dr, dc = DELTA[st.direction]
        fwd_dies = (st.pos[0] + dr, st.pos[1] + dc) not in self.level.colors
        conds = (None, color) if self.first_fire_only else self.conds
        calls = range(min(highest + 2, self.nfuncs))
        out = []
        for op in ('F', 'L', 'R', *calls):
            for cond in conds:
                fires_now = cond is None or cond == color
                if op == 'F' and fires_now and fwd_dies:
                    continue  # would drive straight into the void
                out.append((cond, op))
        return out

    def snapshot(self):
        out = []
        for func in self.program:
            instrs = []
            for ins in func:
                if ins is None or ins is SEAL:
                    break  # slots are filled front to back
                instrs.append(ins)
            out.append(tuple(instrs))
        return tuple(out)


def solve(level, max_total=None, search_steps=1500, max_depth=64,
          first_fire_only=False):
    """Find a minimal-instruction-count program that wins `level`.

    Returns a program (tuple of per-function instruction tuples) or
    None if no program wins within the given limits. search_steps caps
    how long each candidate may run during the search; raise it for
    levels whose solutions need very long executions. first_fire_only
    is a faster but incomplete search mode (see module docstring).
    """
    start = (level.robot[0], level.robot[1])
    stars = frozenset(level.stars) - {start}
    if not stars:
        return tuple(() for _ in level.func_slots)

    total = sum(level.func_slots)
    if max_total is None or max_total > total:
        max_total = total

    for budget in range(1, max_total + 1):
        search = _Search(level, budget, search_steps, max_depth, first_fire_only)
        state = _State(start, level.robot[2], stars, [[0, 0]], 0, set())
        state.seen.add(state.signature())
        sol = search.run(state, 0, 0)
        if sol is not None and simulate(level, sol, want_trace=False).win:
            return sol
    return None
