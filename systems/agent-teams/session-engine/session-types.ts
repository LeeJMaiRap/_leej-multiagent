// Context summary: post-cleanup state established Session Engine, Agent Registry, and Artifact Store skeletons as the next MVP foundation.
// ECC references emphasize plan/execute separation, code sovereignty, explicit validation, and stop-loss gates before moving phases.
// PM Agent workflow defines PM as orchestrator-only in Agent-Teams mode, with requirements, architecture/API, ownership, execution, QA/integration, and handoff gates.

// Session Mode
export type SessionMode = 'normal-chat' | 'workflow'

// Session Status (full lifecycle)
export type SessionStatus =
  | 'draft'
  | 'intake'
  | 'planning'
  | 'waiting-for-approval'
  | 'executing'
  | 'integrating'
  | 'reviewing'
  | 'done'
  | 'blocked'

// Workflow Type (chỉ 2 loại cho MVP)
export type WorkflowType = 'web-app-project'

// Agent Role
export type AgentRole =
  | 'pm-agent'
  | 'requirements-agent'
  | 'architecture-agent'
  | 'api-contract-agent'
  | 'frontend-agent'
  | 'backend-agent'
  | 'qa-agent'
  | 'integration-agent'

// Agent Status trong session
export type AgentStatus = 'idle' | 'running' | 'done' | 'error' | 'waiting'

// Gate (checkpoint phải pass trước khi tiếp tục)
export interface SessionGate {
  id: string
  label: string
  status: 'pending' | 'passed' | 'failed'
  requiredArtifacts: string[]
  approvedBy?: 'user' | 'pm-agent'
  approvedAt?: string
}

// Agent trong session
export interface SessionAgent {
  role: AgentRole
  status: AgentStatus
  assignedTasks: string[]
  completedTasks: string[]
  reportPath?: string
  lastUpdated: string
}

// Artifact (output file của session)
export interface SessionArtifact {
  id: string
  name: string
  path: string
  status: 'pending' | 'draft' | 'approved' | 'rejected'
  createdBy: AgentRole | 'user'
  createdAt: string
  approvedAt?: string
}

// Task Packet (đơn vị công việc PM giao cho agent)
export interface TaskPacket {
  id: string
  title: string
  assignedTo: AgentRole
  status: 'pending' | 'in-progress' | 'done' | 'rework'
  ownedPaths: string[]
  forbiddenPaths: string[]
  inputs: string[]
  outputs: string[]
  instructions: string
  startedAt?: string
  completedAt?: string
  reportPath?: string
}

// Intake Form (user điền khi tạo web-app-project session)
export interface WebAppIntakeForm {
  projectName: string
  appType: string
  targetUsers: string
  coreFeatures: string[]
  preferredStack: {
    frontend?: string
    backend?: string
    database?: string
  }
  needsAuth: boolean
  needsAdminDashboard: boolean
  designStyle?: string
  deadline?: string
  constraints?: string
  additionalNotes?: string
}

// Session object chính
export interface Session {
  id: string
  slug: string
  mode: SessionMode
  workflowType?: WorkflowType
  status: SessionStatus
  blockedReason?: string
  title: string
  createdAt: string
  updatedAt: string
  intakeForm?: WebAppIntakeForm
  agents: SessionAgent[]
  artifacts: SessionArtifact[]
  taskPackets: TaskPacket[]
  gates: SessionGate[]
  projectPath: string
  chatHistoryPath: string
}

// Chat message đơn giản
export interface ChatMessage {
  role: 'user' | 'assistant' | 'agent'
  agentRole?: AgentRole
  content: string
  timestamp: string
}

// Dùng khi đọc/ghi chat-history.jsonl
export interface ChatHistoryEntry extends ChatMessage {
  sessionId: string
}
