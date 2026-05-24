# Session Engine

Session Engine là lớp contract trung tâm cho Agent-Teams Session MVP. Nó định nghĩa session là gì, có trạng thái nào, dùng agent nào, tạo artifact nào, và gate nào phải pass trước khi tiếp tục.

Phase 1 chỉ định nghĩa contracts. Chưa có logic gọi LLM, chưa ghi file thật, chưa build UI.

## Files

```text
session-engine/
├── README.md
├── index.ts
├── session-types.ts
├── session-router.ts
└── templates/
    ├── normal-chat.json
    └── web-app-project.json
```

- `session-types.ts`: TypeScript types/interfaces cho Session, Agent, TaskPacket, Artifact, Gate, Intake Form.
- `session-router.ts`: public stub functions cho create/get/update/check/dispatch.
- `templates/normal-chat.json`: chat thường, không project, không agent workflow.
- `templates/web-app-project.json`: workflow tạo web/app với PM Agent và specialist agents.
- `index.ts`: public export surface.

## Session modes

### `normal-chat`

Chat như trợ lý AI bình thường. Không tạo project folder, không yêu cầu gates, không auto-add specialist agents.

### `workflow`

Session có workflow rõ ràng. MVP chỉ có `web-app-project`. Workflow tạo project artifacts, dùng PM Agent làm orchestrator và giao task cho specialist agents.

## Lifecycle states

```text
draft
  ↓
intake
  ↓
planning
  ↓
waiting-for-approval
  ↓
executing
  ↓
integrating
  ↓
reviewing
  ↓
done
```

`blocked` có thể xảy ra ở bất kỳ bước nào khi thiếu input, gate fail, có conflict, hoặc cần user quyết định.

## Gates

Gate là checkpoint trước khi session đi tiếp. Mỗi gate có:

- `id`
- `label`
- `status`: `pending`, `passed`, hoặc `failed`
- `requiredArtifacts`: danh sách artifact paths phải tồn tại hoặc được tạo
- `approvedBy`: `user` hoặc `pm-agent` nếu có approval
- `approvedAt`: ISO timestamp nếu đã duyệt

Workflow `web-app-project` dùng gates theo thứ tự:

1. Requirements rõ ràng
2. Architecture được duyệt
3. API contract được duyệt
4. Ownership map rõ
5. Task packets sẵn sàng
6. Implementation verified
7. Integration verified
8. PM acceptance

## PM Agent boundary

PM Agent là orchestrator. PM Agent sở hữu intake, planning, delegation, gate review, risk handling, acceptance, và handoff. Specialist agents sở hữu deliverables theo task packet và owned paths.

## Phase 2 TODO

- Implement file-backed session store.
- Expand templates into runtime defaults.
- Connect Session Engine với agent-wall-chat.
- Add artifact existence checks.
- Add manual dispatch flow for agents.
