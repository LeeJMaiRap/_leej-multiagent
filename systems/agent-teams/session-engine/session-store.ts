import { appendFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { ChatHistoryEntry, Session, WorkflowType } from './session-types.ts'

export const BASE_PROJECTS_DIR = process.env.PROJECTS_DIR ?? 'projects/active'

interface WorkflowTemplate {
  projectFolderStructure?: string[]
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function sessionFilePath(slug: string): string {
  return path.join(BASE_PROJECTS_DIR, slug, 'session.json')
}

function toSystemPath(projectPath: string): string {
  return projectPath.replace(/^projects\/active\/?/, BASE_PROJECTS_DIR + '/')
}

async function readWorkflowTemplate(workflowType?: WorkflowType): Promise<WorkflowTemplate> {
  if (!workflowType) return {}

  const templatePath = path.join(__dirname, 'templates', `${workflowType}.json`)
  const raw = await readFile(templatePath, 'utf8')
  return JSON.parse(raw) as WorkflowTemplate
}

export async function saveSession(session: Session): Promise<void> {
  const dir = path.join(BASE_PROJECTS_DIR, session.slug)
  await mkdir(dir, { recursive: true })
  await writeFile(sessionFilePath(session.slug), JSON.stringify(session, null, 2), 'utf8')
}

export async function loadSession(sessionId: string): Promise<Session | null> {
  const sessions = await listSessions()
  return sessions.find((session) => session.id === sessionId) ?? null
}

export async function loadSessionBySlug(slug: string): Promise<Session | null> {
  try {
    const raw = await readFile(sessionFilePath(slug), 'utf8')
    return JSON.parse(raw) as Session
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null
    throw error
  }
}

export async function listSessions(): Promise<Session[]> {
  let entries
  try {
    entries = await readdir(BASE_PROJECTS_DIR, { withFileTypes: true })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw error
  }

  const sessions: Session[] = []
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const session = await loadSessionBySlug(entry.name)
    if (session) sessions.push(session)
  }

  return sessions.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}

export async function appendChatMessage(
  session: Session,
  message: ChatHistoryEntry
): Promise<void> {
  const chatHistoryPath = toSystemPath(session.chatHistoryPath)
  await mkdir(path.dirname(chatHistoryPath), { recursive: true })
  await appendFile(chatHistoryPath, JSON.stringify(message) + '\n', 'utf8')
}

export async function readChatHistory(session: Session): Promise<ChatHistoryEntry[]> {
  try {
    const raw = await readFile(toSystemPath(session.chatHistoryPath), 'utf8')
    return raw
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line) as ChatHistoryEntry)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw error
  }
}

export async function createProjectFolders(session: Session): Promise<void> {
  const projectDir = toSystemPath(session.projectPath)
  await mkdir(projectDir, { recursive: true })

  const template = await readWorkflowTemplate(session.workflowType)
  for (const folder of template.projectFolderStructure ?? []) {
    await mkdir(path.join(projectDir, folder), { recursive: true })
  }
}
