import { randomUUID } from 'node:crypto'

export function toSlug(name: string): string {
  const slug = name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug || 'untitled-session'
}

export function generateSessionId(): string {
  return randomUUID()
}

export function nowISO(): string {
  return new Date().toISOString()
}

export function getProjectPath(slug: string): string {
  return `projects/active/${slug}/`
}

export function getChatHistoryPath(slug: string): string {
  return `projects/active/${slug}/chat-history.jsonl`
}
