// Context summary: post-cleanup state established Session Engine, Agent Registry, and Artifact Store skeletons as the next MVP foundation.
// ECC references emphasize plan/execute separation, code sovereignty, explicit validation, and stop-loss gates before moving phases.
// PM Agent workflow defines PM as orchestrator-only in Agent-Teams mode, with requirements, architecture/API, ownership, execution, QA/integration, and handoff gates.

import { access, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { BASE_PROJECTS_DIR, createProjectFolders, loadSession, saveSession } from './session-store.ts'
import type { AgentRole, Session, SessionArtifact, SessionGate, SessionMode, WorkflowType, WebAppIntakeForm } from './session-types.ts'
import { generateSessionId, getChatHistoryPath, getProjectPath, nowISO, toSlug } from './utils.ts'

interface SessionTemplate {
  id: string
  label: string
  leadAgent: AgentRole | null
  agents: AgentRole[]
  gates: Array<Pick<SessionGate, 'id' | 'label' | 'requiredArtifacts'>>
  requiredArtifacts: string[]
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * SessionRouter — điều hướng giữa Normal Chat và Workflow Session
 *
 * Hiện tại: tạo/lưu session file-backed. Chưa gọi LLM hoặc agent runtime thật.
 */

async function loadTemplate(mode: SessionMode, workflowType?: WorkflowType): Promise<SessionTemplate> {
  const templateName = mode === 'normal-chat' ? 'normal-chat' : workflowType
  if (!templateName) throw new Error('workflowType is required for workflow sessions')

  const raw = await readFile(path.join(__dirname, 'templates', `${templateName}.json`), 'utf8')
  return JSON.parse(raw) as SessionTemplate
}

function artifactName(artifactPath: string): string {
  return artifactPath.replace(/\/$/, '').split('/').pop() || artifactPath
}

function createArtifacts(template: SessionTemplate, createdAt: string): SessionArtifact[] {
  return template.requiredArtifacts.map((artifactPath) => ({
    id: artifactPath,
    name: artifactName(artifactPath),
    path: artifactPath,
    status: 'pending',
    createdBy: 'pm-agent',
    createdAt
  }))
}

function toSystemPath(projectRelativePath: string): string {
  return projectRelativePath.replace(/^projects\/active\/?/, BASE_PROJECTS_DIR + '/')
}

async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await access(targetPath)
    return true
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false
    throw error
  }
}

// Tạo session mới
export async function createSession(params: {
  mode: SessionMode
  workflowType?: WorkflowType
  intakeForm?: WebAppIntakeForm
}): Promise<Session> {
  const template = await loadTemplate(params.mode, params.workflowType)
  const title = params.intakeForm?.projectName ?? template.label
  const slug = toSlug(title)
  const timestamp = nowISO()
  const projectPath = getProjectPath(slug)

  const session: Session = {
    id: generateSessionId(),
    slug,
    mode: params.mode,
    workflowType: params.workflowType,
    status: params.mode === 'normal-chat' ? 'draft' : 'intake',
    title,
    createdAt: timestamp,
    updatedAt: timestamp,
    intakeForm: params.intakeForm,
    agents: template.agents.map((role) => ({
      role,
      status: 'idle',
      assignedTasks: [],
      completedTasks: [],
      lastUpdated: timestamp
    })),
    artifacts: createArtifacts(template, timestamp),
    taskPackets: [],
    gates: template.gates.map((gate) => ({ ...gate, status: 'pending' })),
    projectPath,
    chatHistoryPath: getChatHistoryPath(slug)
  }

  await createProjectFolders(session)
  await saveSession(session)
  return session
}

// Lấy session theo ID
export async function getSession(sessionId: string): Promise<Session | null> {
  return loadSession(sessionId)
}

// Cập nhật status session
export async function updateSessionStatus(
  sessionId: string,
  status: Session['status'],
  blockedReason?: string
): Promise<void> {
  const session = await loadSession(sessionId)
  if (!session) throw new Error(`Session not found: ${sessionId}`)
  if (status === 'blocked' && !blockedReason) {
    throw new Error('blockedReason is required when setting session status to blocked')
  }

  session.status = status
  session.blockedReason = status === 'blocked' ? blockedReason : undefined
  session.updatedAt = nowISO()
  await saveSession(session)
}

// Kiểm tra gate có pass không
export async function checkGate(
  sessionId: string,
  gateId: string
): Promise<{ passed: boolean; missingArtifacts: string[] }> {
  const session = await loadSession(sessionId)
  if (!session) throw new Error(`Session not found: ${sessionId}`)

  const gate = session.gates.find((candidate) => candidate.id === gateId)
  if (!gate) throw new Error(`Gate not found: ${gateId}`)

  const missingArtifacts: string[] = []
  for (const requiredArtifact of gate.requiredArtifacts) {
    if (requiredArtifact.endsWith('/')) {
      const folderPath = path.join(toSystemPath(session.projectPath), requiredArtifact)
      if (!(await pathExists(folderPath))) missingArtifacts.push(requiredArtifact)
      continue
    }

    const artifact = session.artifacts.find((candidate) =>
      candidate.id === requiredArtifact || candidate.path.endsWith(requiredArtifact)
    )
    if (artifact?.status !== 'approved') missingArtifacts.push(requiredArtifact)
  }

  return { passed: missingArtifacts.length === 0, missingArtifacts }
}

// Dispatch agent chạy task (manual trigger)
export async function dispatchAgent(params: {
  sessionId: string
  agentRole: AgentRole
  taskPacketId: string
}): Promise<void> {
  void params
  throw new Error('TODO: implement dispatchAgent')
}
