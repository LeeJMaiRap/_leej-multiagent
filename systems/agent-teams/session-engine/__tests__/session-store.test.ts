import assert from 'node:assert/strict'
import { access, mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'

const testRoot = await mkdtemp(path.join(tmpdir(), 'session-engine-'))
process.env.PROJECTS_DIR = testRoot

const { createSession, checkGate } = await import('../session-router.ts')
const { appendChatMessage, loadSession, saveSession, readChatHistory } = await import('../session-store.ts')
const { toSlug } = await import('../utils.ts')

test.after(async () => {
  await rm(testRoot, { recursive: true, force: true })
})

test('createSession with normal-chat mode creates expected session object', async () => {
  const session = await createSession({ mode: 'normal-chat' })

  assert.equal(session.mode, 'normal-chat')
  assert.equal(session.status, 'draft')
  assert.equal(session.workflowType, undefined)
  assert.equal(session.slug, 'tro-chuyen-thuong')
  assert.equal(session.projectPath, 'projects/active/tro-chuyen-thuong/')
  assert.equal(session.chatHistoryPath, 'projects/active/tro-chuyen-thuong/chat-history.jsonl')
  assert.deepEqual(session.agents, [])
  assert.deepEqual(session.gates, [])
})

test('createSession with web-app-project creates folder structure', async () => {
  const session = await createSession({
    mode: 'workflow',
    workflowType: 'web-app-project',
    intakeForm: {
      projectName: 'My Cool App!',
      appType: 'SaaS web app',
      targetUsers: 'Small teams',
      coreFeatures: ['login', 'dashboard'],
      preferredStack: { frontend: 'React', backend: 'Node', database: 'SQLite' },
      needsAuth: true,
      needsAdminDashboard: true
    }
  })

  assert.equal(session.slug, 'my-cool-app')
  assert.equal(session.agents.length, 7)
  assert.equal(session.gates.length, 8)

  const expectedFolders = [
    '00-intake',
    '01-requirements',
    '02-architecture',
    '03-contracts',
    '04-planning',
    '05-execution/task-packets',
    '05-execution/agent-reports',
    '06-integration',
    '07-review',
    '08-handoff',
    '09-retrospective'
  ]

  for (const folder of expectedFolders) {
    await access(path.join(testRoot, session.slug, folder))
  }

  const sessionFile = await readFile(path.join(testRoot, session.slug, 'session.json'), 'utf8')
  assert.equal(JSON.parse(sessionFile).id, session.id)
})

test('saveSession and loadSession round-trip preserves session data', async () => {
  const session = await createSession({ mode: 'normal-chat' })
  session.title = 'Round Trip Session'
  await saveSession(session)

  const loaded = await loadSession(session.id)
  assert.equal(loaded?.id, session.id)
  assert.equal(loaded?.title, 'Round Trip Session')
  assert.equal(loaded?.slug, session.slug)
  assert.deepEqual(loaded?.agents, session.agents)
})

test('appendChatMessage and readChatHistory round-trip jsonl entries', async () => {
  const session = await createSession({ mode: 'normal-chat' })
  const message = {
    sessionId: session.id,
    role: 'user' as const,
    content: 'Xin chào',
    timestamp: new Date('2026-05-25T00:00:00.000Z').toISOString()
  }

  await appendChatMessage(session, message)

  const history = await readChatHistory(session)
  assert.deepEqual(history, [message])
})

test('checkGate returns false when required artifact is not approved', async () => {
  const session = await createSession({
    mode: 'workflow',
    workflowType: 'web-app-project',
    intakeForm: {
      projectName: 'Gate Test',
      appType: 'admin dashboard',
      targetUsers: 'operators',
      coreFeatures: ['reports'],
      preferredStack: {},
      needsAuth: false,
      needsAdminDashboard: true
    }
  })

  const result = await checkGate(session.id, 'gate-1')
  assert.equal(result.passed, false)
  assert.deepEqual(result.missingArtifacts, ['requirements.md'])
})

test('toSlug converts edge cases', () => {
  assert.equal(toSlug('My Cool App!'), 'my-cool-app')
  assert.equal(toSlug('  Multi---Agent___System  '), 'multi-agent-system')
  assert.equal(toSlug(''), 'untitled-session')
})
