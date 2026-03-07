Implement the project end-to-end without pausing for confirmation.

## Execution mode

You must continue through the full plan until the project is complete and fully validated.

### Non-negotiable rules

* Do not stop after a milestone to ask questions or wait for approval.
* Do not defer obvious decisions. If something is ambiguous, choose a reasonable default, document it, and continue.
* Do not treat chat context as the source of truth. Use repository files as the working memory.
* Keep `plans.md` current as work progresses.
* Keep `documentation.md` current as behavior changes.
* Follow the repository harness:

  * `AGENTS.md` is the routing layer
  * `WORKFLOW.md` defines execution behavior
  * `plans.md` is the active implementation plan for this task
  * repo docs are the system of record

## Primary source of truth

Treat `plans.md` as the implementation contract for this task.

Before each milestone:

* read the relevant sections of `plans.md`
* update any ambiguous or missing decisions in `plans.md`
* then implement

If reality changes during implementation:

* update `plans.md`
* update any affected source-of-truth docs
* then continue

## Required working style

Implement deliberately in small, reviewable commits.

Rules:

* keep changes scoped to the current milestone
* avoid bundling unrelated refactors
* prefer simple, inspectable implementations
* preserve determinism where required
* add tests with the implementation, not later
* keep the app runnable throughout the process when practical

For medium or large changes, maintain:

* milestone status
* implementation notes
* verification checklist
* decisions/tradeoffs

inside `plans.md`.

## Milestone loop

For every milestone in `plans.md`, do all of the following before moving on:

1. Implement the milestone completely.
2. Add or update tests covering the milestone’s core behavior.
3. Run verification commands for the affected scope, including:

   * lint
   * typecheck
   * unit tests
   * snapshot tests
   * integration checks where applicable
4. Fix all failures immediately.
5. Update `plans.md`:

   * mark milestone progress accurately
   * record implementation notes
   * update verification checklist
   * record any decisions made
6. Commit with a clear message that references the milestone name.

Do not move to the next milestone with known failing checks.

## Bug handling

If you discover a bug at any point:

1. Write a failing test that reproduces it.
2. Fix the bug.
3. Verify the new test passes.
4. Add a brief note to `plans.md` under `Implementation Notes`.
5. Commit the fix in scope with the current milestone unless it clearly requires a separate fix commit.

Do not silently patch bugs without adding coverage.

## Validation requirements

Maintain a `Verification Checklist` section in `plans.md` and keep it accurate.

Validation is not complete until the repo passes the required checks for the implemented scope.

Determinism is required for:

* serialization
* ops journaling
* replay
* export codegen

Enforce determinism with:

* snapshot tests
* stable ordering
* explicit normalization where needed
* reproducible fixtures

If nondeterminism appears, fix it before proceeding.

## Documentation requirements

Create and maintain `documentation.md` as implementation proceeds.

It must stay concise, accurate, and aligned with the repo state.

By the end, `documentation.md` must include:

* what Design Desk is
* local setup
* one-command dev start
* how to run tests, lint, and typecheck
* how to run the export CLI, with examples
* how to demo multiplayer locally using two tabs and a session link
* how to demo replay mode
* repo structure overview
* high-level design file format overview
* troubleshooting for the most likely issues and fixes

Do not leave documentation as a final cleanup task. Update it during implementation.

## Completion criteria

Do not stop until every item below is true:

* all milestones in `plans.md` are implemented and checked off
* `pnpm dev` works
* the demo starter file loads by default
* multiplayer works in two tabs with:

  * presence
  * cursors
  * selections
  * shared edits
* replay mode works with:

  * scrubber
  * speed controls
  * branch-from-here
* export works and is deterministic
* snapshot tests prove determinism
* `pnpm test` passes
* `pnpm lint` passes
* `pnpm typecheck` passes
* `documentation.md` is accurate and complete

## Start condition

Start by reading `plans.md` and executing Milestone 1.

Do not pause for confirmation between milestones. Continue until the full project is complete, validated, and documented.
