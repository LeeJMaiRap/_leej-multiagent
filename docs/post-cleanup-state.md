# Post-cleanup State Snapshot

## Repo structure after cleanup

```text
.claude/
.clawhub/
.openclaw/
_archive/
_archive/agent-teams-phase-history/
_archive/design-history/
_archive/exports/
_archive/future-v2/
_archive/generated-reports/
_archive/knowledge-history/
_archive/memory-history/
_archive/project-samples/
agent-core/
agent-core/memory/
docs/
ops/
ops/scripts/
ops/tmp/
projects/
projects/_index/
projects/active/
projects/archived/
projects/on-hold/
shared/
state/
systems/
systems/agent-teams/
systems/agent-teams/agent-registry/
systems/agent-teams/agents/
systems/agent-teams/apps/
systems/agent-teams/architecture/
systems/agent-teams/artifact-store/
systems/agent-teams/examples/
systems/agent-teams/references/
systems/agent-teams/reports/
systems/agent-teams/runbooks/
systems/agent-teams/runtime/
systems/agent-teams/session-engine/
systems/agent-teams/skills/
systems/agent-teams/templates/
systems/pm-agent/
systems/pm-agent/architecture/
systems/pm-agent/eval/
systems/pm-agent/prompts/
systems/pm-agent/reports/
systems/pm-agent/runtime/
systems/pm-agent/scripts/
systems/pm-agent/skills/
systems/pm-agent/templates/
systems/voice/
systems/voice/output/
systems/voice/scripts/
tmp/
```

Top-level source docs/tools still present:

```text
README.md
BEHAVIOR.md
AGENTS.md
HEARTBEAT.md
IDENTITY.md
SOUL.md
TOOLS.md
USER.md
md_to_pdf.js
md_to_pdf.py
package.json
package-lock.json
```

## Phase summary

### Phase 1 — Archive non-MVP content

Commit: `9582e8b chore: archive non-MVP content to _archive`

Moved non-MVP/history content into `_archive/`:

- Design history:
  - `Plan-Agent-Teams.md`
  - `agent-teams-real-world-structure.md`
- Research/history:
  - `knowledge/`
  - `memory/`
  - dated `agent-core/memory/2026-*.md`
  - `agent-core/memory/daily/`
- Generated/history reports:
  - PM daily reports
  - PM plan reports
  - PM eval reports
- Project samples:
  - `web-ban-acc-game`
  - `pm-agent-e2e-demo-v2`
  - `web-ban-hang`
- Agent-Teams non-canonical phase examples.
- Agent-Teams v2 future docs.
- Ops export zip folder.

### Phase 2 — Remove stale/generated/backup files

Commit: `30a4f2b chore: remove stale/generated/backup files`

Removed only confirmed stale/generated files:

- `systems/agent-teams/apps/agent-wall-chat/state.backup-*.json`
- generated voice mp3 files in `systems/voice/output/`
- duplicate root `tmp/voice/.gitkeep`

### Phase 3 — Prep agent-wall-chat for session-first refactor

Commit: `07df69b chore: prep agent-wall-chat for session-first refactor`

Kept core chat UI and existing logic. Added TODO markers only:

- `server.js`: split runtime state/artifacts/mailbox/reviews/routes/sockets into session services.
- `server.js`: move dashboard demo flow behind `DemoSessionBridge`.
- `bridge.js`: promote bridge into real SessionBridge contract with local and real adapters.

No logic refactor performed.

### Phase 4 — Import ECC reference agents and skills

Commit: `5a512a4 chore: import ECC reference agents and skills`

Imported from `https://github.com/affaan-m/ecc`:

Direct:

- `systems/agent-teams/agents/code-reviewer.md`

Reference/adapt material:

- `systems/agent-teams/agents/ecc-ref/agents/planner.md`
- `systems/agent-teams/agents/ecc-ref/agents/architect.md`
- `systems/agent-teams/agents/ecc-ref/commands/multi-plan.md`
- `systems/agent-teams/agents/ecc-ref/commands/multi-execute.md`
- `systems/agent-teams/agents/ecc-ref/commands/multi-backend.md`
- `systems/agent-teams/agents/ecc-ref/commands/multi-frontend.md`
- `systems/agent-teams/agents/ecc-ref/skills/api-design/`
- `systems/agent-teams/agents/ecc-ref/skills/backend-patterns/`
- `systems/agent-teams/agents/ecc-ref/skills/frontend-patterns/`
- `systems/agent-teams/agents/ecc-ref/skills/deployment-patterns/`

### Phase 5 — Scaffold session-engine and agent-registry

Commit: `d3f9ef7 feat: scaffold session-engine and agent-registry structure`

Created new Session MVP skeleton:

```text
systems/agent-teams/session-engine/
├── README.md
├── session-router.ts
├── session-types.ts
└── templates/
    ├── normal-chat.json
    └── web-app-project.json

systems/agent-teams/agent-registry/
├── README.md
└── agents/
    ├── pm-agent.md
    ├── frontend-agent.md
    ├── backend-agent.md
    ├── requirements-agent.md
    ├── architecture-agent.md
    ├── qa-agent.md
    └── integration-agent.md

systems/agent-teams/artifact-store/
└── README.md
```

`pm-agent.md` was copied from `systems/pm-agent/architecture/SYSTEM-PROMPT.md`.

## Notes

- ECC clone succeeded. No skipped ECC phase.
- `.claude/`, `.clawhub/`, and `.openclaw/` remain present. Cleanup plan marked them local/tool state, but this task only deleted explicitly listed stale/generated files.
- `agent-wall-chat` frontend HTML remains monolithic. It was intentionally not rewritten in cleanup phase.
- Root identity docs still duplicate `agent-core/`; cleanup plan keeps that as a future refactor decision.

## TODO for next implementation step

1. Define real `Session` domain model in `systems/agent-teams/session-engine/session-types.ts`.
2. Expand `normal-chat.json` and `web-app-project.json` into real session templates.
3. Define Session Engine API contract:
   - create session
   - list sessions
   - send message
   - start workflow
   - cancel/pause/resume
   - stream events
   - list artifacts
4. Refactor `agent-wall-chat` behind session services without changing UX first.
5. Promote `bridge.js` into local/demo/real SessionBridge adapters.
6. Normalize PM Agent source of truth between `systems/pm-agent/` and `systems/agent-teams/agent-registry/agents/pm-agent.md`.
7. Decide which archived examples become curated fixtures for tests.
