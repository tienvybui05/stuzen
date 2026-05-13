import type { GpaCalculationSnapshot, GpaHistoryEntry } from './types'

const STORAGE_KEY = 'stuzen:gpa-history'
const MAX_HISTORY_ITEMS = 8

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage)
}

export function loadGpaHistory(): GpaHistoryEntry[] {
  if (!canUseStorage()) {
    return []
  }

  try {
    const rawHistory = window.localStorage.getItem(STORAGE_KEY)
    if (!rawHistory) {
      return []
    }

    const parsedHistory = JSON.parse(rawHistory)
    return Array.isArray(parsedHistory) ? parsedHistory : []
  } catch {
    return []
  }
}

export function saveGpaHistory(history: GpaHistoryEntry[]) {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}

export function createHistoryEntry(
  snapshot: GpaCalculationSnapshot,
): GpaHistoryEntry {
  return {
    ...snapshot,
    createdAt: new Date().toISOString(),
    id: crypto.randomUUID(),
  }
}

export function appendGpaHistory(
  history: GpaHistoryEntry[],
  snapshot: GpaCalculationSnapshot,
) {
  return [createHistoryEntry(snapshot), ...history].slice(0, MAX_HISTORY_ITEMS)
}
