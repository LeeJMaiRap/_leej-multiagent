# Cleanup Plan — Agent-Teams Session MVP

## Stop rule

Plan này chỉ đề xuất. Chưa xóa/move gì. Cần user confirm trước mọi thao tác cleanup thật.

## Hướng cleanup

MVP mới cần repo gọn quanh:

```text
Session Engine
├── Normal Chat
├── Workflow Session
│   └── web-app-project
├── PM Agent Orchestrator
├── Agent Team Registry
├── Artifact Store
├── Voice adapters
├── PDF/report tools
└── Session-first UI
```

## Sẽ GIỮ nguyên

### Core Agent-Teams

- [systems/agent-teams/README.md](../systems/agent-teams/README.md)
- [systems/agent-teams/architecture/](../systems/agent-teams/architecture/)
- [systems/agent-teams/runtime/](../systems/agent-teams/runtime/)
- [systems/agent-teams/templates/](../systems/agent-teams/templates/)
- [systems/agent-teams/agents/](../systems/agent-teams/agents/)
- [systems/agent-teams/runbooks/](../systems/agent-teams/runbooks/)
- [systems/agent-teams/references/](../systems/agent-teams/references/)

Lý do: đây là nền protocol, roles, gates, task packet/report cho Session-based Agent-Teams.

### PM Agent source

- [systems/pm-agent/README.md](../systems/pm-agent/README.md)
- [systems/pm-agent/architecture/](../systems/pm-agent/architecture/)
- [systems/pm-agent/runtime/](../systems/pm-agent/runtime/)
- [systems/pm-agent/prompts/](../systems/pm-agent/prompts/)
- [systems/pm-agent/templates/](../systems/pm-agent/templates/)
- [systems/pm-agent/skills/document-generation/](../systems/pm-agent/skills/document-generation/)
- [systems/pm-agent/eval/checklists/](../systems/pm-agent/eval/checklists/)
- [systems/pm-agent/eval/scenarios/](../systems/pm-agent/eval/scenarios/)

Lý do: PM Agent là orchestrator chính của hướng mới.

### Voice + reports

- [systems/voice/README.md](../systems/voice/README.md)
- [ops/scripts/voice/](../ops/scripts/voice/)
- [ops/tmp/voice/](../ops/tmp/voice/) structure only
- [md_to_pdf.js](../md_to_pdf.js)
- [md_to_pdf.py](../md_to_pdf.py)
- [package.json](../package.json)
- [package-lock.json](../package-lock.json)

Lý do: voice/TTS/STT và PDF/report vẫn thuộc hệ thống Agent-Teams assistant.

### Workspace docs/state roots

- [README.md](../README.md)
- [BEHAVIOR.md](../BEHAVIOR.md)
- [systems/README.md](../systems/README.md)
- [ops/README.md](../ops/README.md)
- [projects/README.md](../projects/README.md)
- [shared/README.md](../shared/README.md)
- [state/README.md](../state/README.md)
- [agent-core/](../agent-core/)

Lý do: giữ map repo và canonical identity/memory source.

## Sẽ ARCHIVE vào `_archive/`

Đề xuất target:

```text
_archive/
├── design-history/
├── knowledge-history/
├── memory-history/
├── generated-reports/
├── project-samples/
├── agent-teams-phase-history/
├── future-v2/
└── exports/
```

### Design/history docs

- [Plan-Agent-Teams.md](../Plan-Agent-Teams.md) → `_archive/design-history/Plan-Agent-Teams.md`
- [agent-teams-real-world-structure.md](../agent-teams-real-world-structure.md) → `_archive/design-history/agent-teams-real-world-structure.md`

Lý do: hữu ích tham khảo nhưng nên trích tinh hoa vào docs chính.

### Knowledge/research

- [knowledge/](../knowledge/) → `_archive/knowledge-history/`

Lý do: PM research/meeting/history, không phải runtime MVP.

### Old memory/logs

- [memory/](../memory/) → `_archive/memory-history/root-memory/`
- `agent-core/memory/2026-*.md` → `_archive/memory-history/agent-core-daily/`
- `agent-core/memory/daily/` → `_archive/memory-history/agent-core-daily/`

Giữ lại trong [agent-core/memory/](../agent-core/memory/):
- `MEMORY_SCHEMA.md`
- `index.json`
- `observations/` nếu còn dùng làm canonical observations

Lý do: dated logs làm repo nhiễu. Schema/observations vẫn có giá trị.

### Generated reports

- `systems/pm-agent/reports/daily/` → `_archive/generated-reports/pm-agent-daily/`
- `systems/pm-agent/reports/plans/` → `_archive/generated-reports/pm-agent-plans/`
- `systems/pm-agent/eval/reports/` → `_archive/generated-reports/pm-agent-eval/`

Lý do: output history, không phải source.

### Project samples

- [projects/active/web-ban-acc-game/](../projects/active/web-ban-acc-game/) → `_archive/project-samples/web-ban-acc-game/`
- [projects/archived/pm-agent-e2e-demo-v2/](../projects/archived/pm-agent-e2e-demo-v2/) → `_archive/project-samples/pm-agent-e2e-demo-v2/`
- [projects/on-hold/web-ban-hang/](../projects/on-hold/web-ban-hang/) → `_archive/project-samples/web-ban-hang/`

Lý do: không trực tiếp thuộc Session Engine MVP; giữ làm sample thay vì xóa.

### Agent-Teams phase history

Trong [systems/agent-teams/examples/](../systems/agent-teams/examples/):

Giữ canonical examples:
- `demo-web-app-agent-team-flow.md`
- `pm-agent-agent-teams-real-project-pilot-runbook.md`
- `phase-32-mini-issue-tracker-real-pilot/` hoặc một bản curated của nó
- `phase-43-launch-runbook-intake-simulation/` hoặc một bản curated của nó

Archive phần còn lại:
- `systems/agent-teams/examples/phase-*` không được chọn canonical → `_archive/agent-teams-phase-history/examples/`

Lý do: phase history quá nhiều, làm mờ MVP.

### Agent-Teams reports/assets

- `systems/agent-teams/reports/assets/live/` → `_archive/agent-teams-phase-history/reports-live-assets/`
- Generated demo reports không còn active → `_archive/agent-teams-phase-history/reports/`

Giữ:
- `agent-teams-v1-report.md` nếu có
- `agent-teams-overview-report.md` nếu có

### v2 future docs

- [systems/agent-teams/v2/](../systems/agent-teams/v2/) → `_archive/future-v2/agent-teams-v2/`

Lý do: future governance/deployment policies, chưa cần Session MVP.

### Exports

- [ops/exports/](../ops/exports/) zip files → `_archive/exports/pm-agent/` hoặc xóa nếu user không cần.

Lý do: generated transfer zips.

## Sẽ XÓA sau confirm

### Runtime/generated local state

- `systems/agent-teams/apps/agent-wall-chat/state.backup-*.json`
- Generated `systems/agent-teams/apps/agent-wall-chat/runs/run-*` nếu không được chọn làm fixture.
- Generated upload files under `systems/agent-teams/apps/agent-wall-chat/uploads/` nếu có.
- [systems/voice/output/doanh-50-chu.mp3](../systems/voice/output/doanh-50-chu.mp3)
- [systems/voice/output/test-voice.mp3](../systems/voice/output/test-voice.mp3)
- [tmp/voice/.gitkeep](../tmp/voice/.gitkeep) and root [tmp/voice/](../tmp/voice/) if no code references it.

Lý do: generated/runtime artifacts. Không nên ở source.

### Local tool state

Chỉ xóa khỏi product source sau confirm:

- [.openclaw/workspace-state.json](../.openclaw/workspace-state.json)
- [.clawhub/lock.json](../.clawhub/lock.json) nếu không cần reproducible plugin state
- [.claude/settings.local.json](../.claude/settings.local.json) nếu không phải intentionally tracked local setting

Lý do: local machine/tool state, không thuộc Session MVP.

## CẦN REFACTOR

### 1. Agent Wall Chat → Session-first UI

Path: [systems/agent-teams/apps/agent-wall-chat/](../systems/agent-teams/apps/agent-wall-chat/)

Giữ concept, refactor structure:

- `server.js`
  - Split into:
    - `sessionStore`
    - `artifactStore`
    - `mailboxService`
    - `reviewService`
    - `bridgeAdapter`
    - `routes`
    - `socketEvents`
- `bridge.js`
  - Promote to real `SessionBridge` contract.
  - Add adapters:
    - `LocalDemoBridge`
    - future `RealSessionBridge`
- `public/index.html`
  - Use as visual prototype only.
  - Rebuild as componentized Session-first UI.
- `state.json`
  - Convert to sample fixture or move to `state/session-ui-demo.json`.
- tests
  - Make smoke/e2e use isolated test state.
  - Add script for `test:acceptance`.

Session-first UI target:

```text
Left: session list
Center: chat / session transcript
Right: session team + artifacts + approvals
Bottom/side: event timeline
```

### 2. PM Agent → PM Orchestrator module

Paths:

- [systems/pm-agent/](../systems/pm-agent/)
- [systems/agent-teams/agents/pm-orchestrator/](../systems/agent-teams/agents/pm-orchestrator/)

Refactor:

- Make Agent-Teams PM Orchestrator source of truth.
- Link/reuse PM Agent prompts, templates, workflows.
- Remove duplicate PM process docs or mark legacy.
- Define PM output for `web-app-project`:
  - intake summary
  - requirements
  - architecture
  - API contract
  - ownership map
  - task packets
  - acceptance report

### 3. Agent specs + skills normalization

Paths:

- [systems/agent-teams/agents/](../systems/agent-teams/agents/)
- [systems/agent-teams/skills/](../systems/agent-teams/skills/)

Refactor:

- Each agent spec should declare:
  - role
  - inputs
  - outputs
  - owned paths
  - forbidden paths
  - required evidence
  - skills used
- Avoid duplicate role instructions in both `agents/*` and `skills/*`.

### 4. Voice scripts canonicalization

Paths:

- [systems/voice/scripts/](../systems/voice/scripts/)
- [ops/scripts/voice/](../ops/scripts/voice/)

Refactor:

- Keep `ops/scripts/voice/` as executable scripts.
- Use [systems/voice/](../systems/voice/) for docs/examples only.
- Archive duplicate legacy scripts after compare.

### 5. Root identity docs

Paths:

- Root `AGENTS.md`, `HEARTBEAT.md`, `IDENTITY.md`, `SOUL.md`, `TOOLS.md`, `USER.md`
- [agent-core/](../agent-core/)

Refactor:

- Compare content.
- Keep [agent-core/](../agent-core/) as canonical.
- Replace root duplicates with short pointers or remove them.

## ECC integration proposal

### Có thể dùng thẳng

- `agents/code-reviewer.md`
  - Use as review agent pattern after implementation phases.
  - Add optional Agent-Teams checks later: idempotency, event log, session race, secret leakage.
- `skills/api-design/`
  - Use for Session Engine REST API conventions.
  - Extend with event stream and idempotency patterns.

### Cần adapt

- `agents/planner.md`
  - Adapt to `Session Planner Agent`.
  - Add outputs: session lifecycle, task graph, gates, artifact map.
- `agents/architect.md`
  - Adapt to `Session Architect Agent`.
  - Add entities: Session, Agent, Task, Event, Artifact, Approval.
- `skills/backend-patterns/`
  - Adapt to Session backend modules:
    - `SessionService`
    - `TaskGraphService`
    - `EventLogRepository`
    - `ArtifactService`
- `skills/frontend-patterns/`
  - Adapt to Session UI:
    - session list
    - chat transcript
    - agent cards
    - timeline
    - approval controls
- `skills/deployment-patterns/`
  - Adapt to local-first MVP and later deploy:
    - `/health`
    - `/ready`
    - model/API availability
    - worker/session runtime readiness

### Chỉ tham khảo concept

- `commands/multi-plan.md`
- `commands/multi-execute.md`
- `commands/multi-backend.md`
- `commands/multi-frontend.md`

Extract concepts:

- Separate plan and execute.
- Explicit approval gate before execution.
- External/worker agents produce reports; orchestrator owns final write/acceptance policy.
- Role routing: backend/frontend/review tasks follow different gates.
- Audit loop after execution.

Do not copy commands directly because ECC assumes Codex/Gemini wrappers and its own command/toolchain layout.

## Proposed cleanup execution order after confirm

### Commit 1: Archive history/docs

Move design/history/knowledge/memory/generated reports into `_archive/`.

### Commit 2: Remove runtime/generated artifacts

Delete state backups, generated audio, run/upload artifacts not selected as fixtures.

### Commit 3: Normalize identity/docs pointers

Resolve root vs `agent-core` duplicates.

### Commit 4: Refactor agent-wall-chat scaffolding only

No full rebuild yet. First isolate runtime state and document Session-first refactor TODOs.

### Commit 5: Add Session MVP docs/specs

Add:

```text
systems/agent-teams/session-engine/
├── session-schema.md
├── session-lifecycle.md
├── web-app-project-template.md
├── artifact-store.md
└── api-contract.md
```

## Review decisions needed

1. Có muốn archive `knowledge/` toàn bộ không, hay giữ vài PM analysis docs gần Agent-Teams?
2. `projects/active/web-ban-acc-game/`: archive hay xóa?
3. `.clawhub/lock.json`: giữ để biết installed skills hay bỏ local state?
4. `systems/agent-teams/examples/`: giữ canonical examples nào?
5. Agent Wall Chat: refactor từ app hiện tại hay rebuild frontend mới hoàn toàn?
