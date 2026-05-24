# Cleanup Audit — Agent-Teams Session MVP

## Mục tiêu audit

Chuẩn bị repo cho hướng mới: Session-based Agent-Teams system. Trung tâm là Session Engine; dashboard chỉ phản ánh session state. Không xóa/move ở bước này.

## Cấu trúc repo tối đa 3 cấp

```text
.claude/
.clawhub/
.openclaw/
agent-core/
agent-core/memory/
knowledge/
knowledge/meetings/
knowledge/pm-agent/
memory/
memory/.dreams/
ops/
ops/exports/
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
systems/agent-teams/agents/
systems/agent-teams/apps/
systems/agent-teams/architecture/
systems/agent-teams/examples/
systems/agent-teams/references/
systems/agent-teams/reports/
systems/agent-teams/runbooks/
systems/agent-teams/runtime/
systems/agent-teams/skills/
systems/agent-teams/templates/
systems/agent-teams/v2/
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
tmp/voice/
```

Top-level files:

```text
.gitignore
AGENTS.md
BEHAVIOR.md
HEARTBEAT.md
IDENTITY.md
Plan-Agent-Teams.md
README.md
SOUL.md
TOOLS.md
USER.md
agent-teams-real-world-structure.md
md_to_pdf.js
md_to_pdf.py
package-lock.json
package.json
```

## Classification legend

- **GIỮ**: liên quan trực tiếp PM Agent, session management, artifact store, voice/TTS/STT, PDF/report tools, hoặc chat UI foundation.
- **ARCHIVE**: hữu ích sau này nhưng chưa cần trong MVP.
- **XÓA**: runtime/generated/unrelated/duplicate abandoned.
- **CẦN REFACTOR**: có giá trị nhưng cần làm lại cho Session Engine.

## Top-level classification

| Path | Verdict | Lý do |
|---|---|---|
| [README.md](../README.md) | GIỮ | Workspace map hiện tại. Cần update sau cleanup. |
| [BEHAVIOR.md](../BEHAVIOR.md) | GIỮ | Có phase order và behavior constraints cho Agent-Teams. |
| [Plan-Agent-Teams.md](../Plan-Agent-Teams.md) | ARCHIVE | Plan/history hữu ích, không phải runtime source. |
| [agent-teams-real-world-structure.md](../agent-teams-real-world-structure.md) | ARCHIVE | Design note hữu ích, nên trích ý vào docs chính rồi archive. |
| [agent-core/](../agent-core/) | GIỮ | Identity/memory canonical. |
| Root `AGENTS.md`, `SOUL.md`, `TOOLS.md`, `USER.md`, `IDENTITY.md`, `HEARTBEAT.md` | CẦN REFACTOR | Duplicate với [agent-core/](../agent-core/). Cần diff trước khi xóa/pointer hóa. |
| [systems/](../systems/) | GIỮ | Main product systems. |
| [systems/agent-teams/](../systems/agent-teams/) | GIỮ | Core Agent-Teams foundation. |
| [systems/pm-agent/](../systems/pm-agent/) | CẦN REFACTOR | PM Agent giá trị cao nhưng overlap Agent-Teams PM Orchestrator. |
| [systems/voice/](../systems/voice/) | GIỮ | STT/TTS docs/scripts/output examples. |
| [ops/scripts/voice/](../ops/scripts/voice/) | GIỮ | Actual voice automation scripts. |
| [ops/tmp/](../ops/tmp/) | GIỮ structure | Runtime artifact dirs. Keep `.gitkeep`, ignore contents. |
| [ops/exports/](../ops/exports/) | ARCHIVE/XÓA | Generated PM zip exports. Không cần trong MVP source. |
| [knowledge/](../knowledge/) | ARCHIVE | PM research/history. Hữu ích reference nhưng không runtime MVP. |
| [memory/](../memory/) | ARCHIVE | Old dated memory/logs. Không nên là product source. |
| [projects/_index/](../projects/_index/) | GIỮ/ARCHIVE | Registry docs có thể dùng cho session/project index; chưa core. |
| [projects/active/web-ban-acc-game/](../projects/active/web-ban-acc-game/) | ARCHIVE | App payload unrelated MVP; giữ làm sample nếu cần. Không xóa thẳng. |
| [projects/archived/](../projects/archived/) | ARCHIVE | Old demos. |
| [projects/on-hold/](../projects/on-hold/) | ARCHIVE | Paused projects, not MVP. |
| [shared/](../shared/) | GIỮ | Future shared modules/docs; currently README only. |
| [state/](../state/) | GIỮ | Intended state area; useful for Session Engine. |
| [tmp/](../tmp/) | XÓA/REFACTOR | Duplicate temp root; voice temp already under `ops/tmp/voice`. |
| [md_to_pdf.js](../md_to_pdf.js), [md_to_pdf.py](../md_to_pdf.py) | GIỮ | PDF/report tooling. |
| [package.json](../package.json), [package-lock.json](../package-lock.json) | GIỮ | PDF/report deps. |
| [.claude/](../.claude/) | XÓA/local only | Local Claude config/worktrees. Do not keep as product source. |
| [.clawhub/](../.clawhub/) | XÓA/local only | Tool lock state. Review if needed for plugin reproducibility. |
| [.openclaw/](../.openclaw/) | XÓA/local only | Local OpenClaw workspace state. |

## systems/agent-teams audit

| Path | Verdict | Lý do |
|---|---|---|
| [systems/agent-teams/README.md](../systems/agent-teams/README.md) | GIỮ | Current Agent-Teams overview and entrypoint. |
| [systems/agent-teams/architecture/](../systems/agent-teams/architecture/) | GIỮ | Role/orchestration/communication/ownership model. |
| [systems/agent-teams/runtime/](../systems/agent-teams/runtime/) | GIỮ | Delegation, reporting, quality gates, lifecycle, parallel waves. |
| [systems/agent-teams/templates/](../systems/agent-teams/templates/) | GIỮ | Task/report/ownership/API/verification templates. |
| [systems/agent-teams/agents/](../systems/agent-teams/agents/) | GIỮ | Specialist role definitions. MVP may expose subset first. |
| [systems/agent-teams/skills/](../systems/agent-teams/skills/) | CẦN REFACTOR | Useful role skills, may duplicate agent specs. Need normalize. |
| [systems/agent-teams/runbooks/](../systems/agent-teams/runbooks/) | GIỮ | Local project launch and v1 operating guide. |
| [systems/agent-teams/apps/agent-wall-chat/](../systems/agent-teams/apps/agent-wall-chat/) | CẦN REFACTOR | Good prototype, but dashboard-first/realtime local state. Needs Session-first model. |
| [systems/agent-teams/examples/](../systems/agent-teams/examples/) | ARCHIVE partial | Keep 1-2 canonical examples, archive phase history/pilots. |
| [systems/agent-teams/reports/](../systems/agent-teams/reports/) | ARCHIVE partial | Keep overview reports; archive live/generated assets. |
| [systems/agent-teams/references/](../systems/agent-teams/references/) | GIỮ | Reference docs for Agent-Teams. |
| [systems/agent-teams/v2/](../systems/agent-teams/v2/) | ARCHIVE | Future governance/deployment material, too heavy for MVP. |

## systems/pm-agent audit

| Path | Verdict | Lý do |
|---|---|---|
| [systems/pm-agent/README.md](../systems/pm-agent/README.md) | GIỮ | PM Agent identity and capabilities. |
| [systems/pm-agent/architecture/](../systems/pm-agent/architecture/) | GIỮ | System prompt, workflow, state schema, storage rules. |
| [systems/pm-agent/runtime/](../systems/pm-agent/runtime/) | GIỮ | PM runtime policies. |
| [systems/pm-agent/prompts/](../systems/pm-agent/prompts/) | GIỮ | Prompt source material. |
| [systems/pm-agent/skills/document-generation/](../systems/pm-agent/skills/document-generation/) | GIỮ | Report/PRD generation relevant. |
| [systems/pm-agent/reports/daily/](../systems/pm-agent/reports/daily/) | ARCHIVE | Dated generated reports. |
| [systems/pm-agent/reports/plans/](../systems/pm-agent/reports/plans/) | ARCHIVE | Old PM plans/history. |
| [systems/pm-agent/eval/checklists/](../systems/pm-agent/eval/checklists/) | GIỮ | Useful validation. |
| [systems/pm-agent/eval/scenarios/](../systems/pm-agent/eval/scenarios/) | GIỮ | Useful PM test scenarios. |
| [systems/pm-agent/eval/reports/](../systems/pm-agent/eval/reports/) | ARCHIVE | Generated evaluation reports. |
| [systems/pm-agent/templates/](../systems/pm-agent/templates/) | GIỮ | PM docs templates. |
| [systems/pm-agent/scripts/](../systems/pm-agent/scripts/) | GIỮ/REFACTOR | Keep if active report/project utilities; verify individually. |

## systems/voice and ops voice audit

| Path | Verdict | Lý do |
|---|---|---|
| [systems/voice/README.md](../systems/voice/README.md) | GIỮ | Current portable voice docs. |
| [systems/voice/scripts/](../systems/voice/scripts/) | CẦN REFACTOR | Legacy/simple voice scripts may duplicate `ops/scripts/voice`. |
| [systems/voice/output/](../systems/voice/output/) | XÓA | Generated mp3 examples (`doanh-50-chu.mp3`, `test-voice.mp3`). |
| [ops/scripts/voice/](../ops/scripts/voice/) | GIỮ | Current STT/TTS/Telegram scripts. |
| [ops/tmp/voice/](../ops/tmp/voice/) | GIỮ structure | Runtime folders with `.gitkeep`. |

## agent-wall-chat audit

Path: [systems/agent-teams/apps/agent-wall-chat/](../systems/agent-teams/apps/agent-wall-chat/)

### Main files/components

| Path | Verdict | Notes |
|---|---|---|
| [package.json](../systems/agent-teams/apps/agent-wall-chat/package.json) | GIỮ/REFACTOR | Express/socket/multer app. Check unused `dagre`/`openai`. |
| [server.js](../systems/agent-teams/apps/agent-wall-chat/server.js) | CẦN REFACTOR | Monolith: state, routes, socket, demo flow, artifacts, reviews. |
| [bridge.js](../systems/agent-teams/apps/agent-wall-chat/bridge.js) | GIỮ/REFACTOR | Good `SessionBridge` seam; real binding disabled. |
| [public/index.html](../systems/agent-teams/apps/agent-wall-chat/public/index.html) | CẦN REFACTOR | Whole UI in one HTML file. Use as visual prototype, rebuild componentized. |
| [tests/smoke.js](../systems/agent-teams/apps/agent-wall-chat/tests/smoke.js) | GIỮ/REFACTOR | Useful smoke, but mutates state and needs server already running. |
| [tests/e2e-acceptance.js](../systems/agent-teams/apps/agent-wall-chat/tests/e2e-acceptance.js) | GIỮ/REFACTOR | Useful acceptance flow; add script and isolate test state later. |
| `state.json` | ARCHIVE/REFACTOR | Demo/runtime state; should become fixture or generated local data. |
| `state.backup-*.json` | XÓA | Runtime backups. |
| `runs/run-*` | ARCHIVE/XÓA | Generated run artifacts; keep only explicit fixtures. |
| `uploads/` | GIỮ structure | Runtime upload area; use central artifact store later. |
| `AGENTS.md`, `BOOTSTRAP.md`, `HEARTBEAT.md`, `IDENTITY.md`, `SOUL.md`, `TOOLS.md`, `USER.md` | CẦN REFACTOR | App-local identity docs duplicate root/agent-core. |

### Reusable for Session-first UI

- Agent identity/status projection: `id`, `name`, `lane`, `status`.
- Mailbox concept: typed task/handoff/question/review/decision/note messages.
- Review gate API: approval/rework flow.
- Artifact preview endpoints and UI concept.
- Health/bridge status panel.
- Socket event push model.
- Workflow graph concept: nodes/edges/status.

### Rebuild/remove for Session-first UI

- Rebuild `public/index.html` as componentized UI.
- Split `server.js` into services/modules:
  - `sessionStore`
  - `artifactStore`
  - `mailboxService`
  - `reviewService`
  - `bridgeAdapter`
  - `routes`
  - `socketEvents`
- Move fake demo flow behind `DemoSessionBridge`.
- Stop treating app `state.json` as source of truth; Session Engine should own state/events.
- Remove committed runtime backups and generated run payloads.

## ECC reference audit

Repo: <https://github.com/affaan-m/ecc>

| ECC path | Verdict | Lý do |
|---|---|---|
| `agents/planner.md` | CẦN ADAPT | Good plan format; adapt with Session lifecycle, task graph, artifacts, gates. |
| `agents/architect.md` | CẦN ADAPT | Good architecture checklist; adapt to Session Engine entities/events/state transitions. |
| `agents/code-reviewer.md` | CÓ THỂ DÙNG THẲNG | Repo-agnostic diff reviewer. Add optional Agent-Teams checks later. |
| `skills/api-design/` | CÓ THỂ DÙNG THẲNG | REST/status/error conventions useful for Session API. Add event stream/idempotency conventions later. |
| `skills/backend-patterns/` | CẦN ADAPT | Useful service/repository/controller pattern; adapt to SessionService/EventLog/TaskGraph. |
| `skills/frontend-patterns/` | CẦN ADAPT | Useful component/hook/state advice; adapt to session list/timeline/approval/agent cards. |
| `skills/deployment-patterns/` | CẦN ADAPT | Useful CI/health/env patterns; adapt to local-first MVP and agent runtime readiness. |
| `commands/multi-plan.md` | CHỈ THAM KHẢO CONCEPT | Good planning/execution separation; command tied to ECC toolchain. |
| `commands/multi-execute.md` | CHỈ THAM KHẢO CONCEPT | Good authority/audit concepts; not portable as-is. |
| `commands/multi-backend.md` | CHỈ THAM KHẢO CONCEPT | Extract backend phase model and approval gate only. |
| `commands/multi-frontend.md` | CHỈ THAM KHẢO CONCEPT | Extract requirement completeness/design review gates only. |

## Uncertainty list

- Root identity files vs `agent-core/*`: need exact diff before deciding delete or pointer.
- `systems/voice/scripts/` vs `ops/scripts/voice/`: need functional compare before archive/delete.
- `systems/agent-teams/examples/`: choose canonical examples before archiving phase history.
- `.clawhub/lock.json`: may be useful for plugin reproducibility; do not delete without confirming plugin strategy.
- `.claude/settings.local.json`: local config; likely should not be committed/product source, but review before removal.
