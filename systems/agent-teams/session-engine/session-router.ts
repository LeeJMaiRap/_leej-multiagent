// Context summary: post-cleanup state established Session Engine, Agent Registry, and Artifact Store skeletons as the next MVP foundation.
// ECC references emphasize plan/execute separation, code sovereignty, explicit validation, and stop-loss gates before moving phases.
// PM Agent workflow defines PM as orchestrator-only in Agent-Teams mode, with requirements, architecture/API, ownership, execution, QA/integration, and handoff gates.

import type { Session, SessionMode, WorkflowType, WebAppIntakeForm } from './session-types'

/**
 * SessionRouter — điều hướng giữa Normal Chat và Workflow Session
 *
 * Hiện tại: stub implementation
 * TODO: Kết nối với actual LLM calls và file system
 */

// Tạo session mới
export async function createSession(params: {
  mode: SessionMode
  workflowType?: WorkflowType
  intakeForm?: WebAppIntakeForm
}): Promise<Session> {
  void params
  throw new Error('TODO: implement createSession')
}

// Lấy session theo ID
export async function getSession(sessionId: string): Promise<Session | null> {
  void sessionId
  throw new Error('TODO: implement getSession')
}

// Cập nhật status session
export async function updateSessionStatus(
  sessionId: string,
  status: Session['status']
): Promise<void> {
  void sessionId
  void status
  throw new Error('TODO: implement updateSessionStatus')
}

// Kiểm tra gate có pass không
export async function checkGate(
  sessionId: string,
  gateId: string
): Promise<{ passed: boolean; missingArtifacts: string[] }> {
  void sessionId
  void gateId
  throw new Error('TODO: implement checkGate')
}

// Dispatch agent chạy task (manual trigger)
export async function dispatchAgent(params: {
  sessionId: string
  agentRole: string
  taskPacketId: string
}): Promise<void> {
  void params
  throw new Error('TODO: implement dispatchAgent')
}
