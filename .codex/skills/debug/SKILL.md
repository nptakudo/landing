---
name: debug
description:
  Investigate stuck runs, retries, and execution failures by tracing application,
  worker, and agent logs with issue, run, and session identifiers; use when runs
  stall, retry repeatedly, fail unexpectedly, or need root-cause isolation.
---

# Debug

## Goals

- Find why a run is stuck, retrying, or failing.
- Correlate ticket, job, run, or session identity quickly.
- Read the right logs in the right order to isolate root cause.

## Log Sources

- Primary runtime log: `log/app.log`
  - Main application/runtime log for orchestrator, worker, agent, and service lifecycle events.
- Rotated runtime logs: `log/app.log*`
  - Check these when the relevant run is older.
- Task- or worker-specific logs: `log/worker.log*`, `log/agent.log*`, or equivalent
  - Use when the system separates orchestration, job execution, or agent activity into dedicated logs.

## Correlation Keys

Use whichever identifiers exist in the repo and logs:

- `issue_identifier`: human-readable ticket key (example: `PROJ-625`)
- `issue_id`: internal issue/task UUID
- `run_id`: workflow or execution run identifier
- `job_id`: background task / worker job identifier
- `session_id`: agent or model session identifier
- `request_id`: request-scoped correlation identifier

Use these fields as join keys during debugging. Prefer human-readable IDs first, then narrow with internal IDs.

## Quick Triage (Stuck Run)

1. Confirm scheduler, worker, or runtime symptoms for the affected ticket or run.
2. Find recent log lines for the ticket, run, or request (`issue_identifier` or `run_id` first).
3. Extract `session_id`, `job_id`, or `request_id` from matching lines.
4. Trace that identifier across start, progress, completion, failure, cancellation, and retry logs.
5. Decide class of failure: timeout/stall, startup failure, task failure, retry loop, worker crash, or external dependency failure.

## Commands

```bash
# 1) Narrow by ticket key or human-readable identifier
rg -n "issue_identifier=PROJ-625" log/*.log*

# 2) Narrow by run or job ID
rg -n "run_id=<run-id>|job_id=<job-id>" log/*.log*

# 3) Pull session IDs seen in logs
rg -o "session_id=[^ ;]+" log/*.log* | sort -u

# 4) Trace one session end-to-end
rg -n "session_id=<session-id>" log/*.log*

# 5) Focus on stuck/retry/failure signals
rg -n "stalled|retry|backoff|timeout|failed|cancelled|crash|error" log/*.log*
