import type { StudentTask } from './types'

const STORAGE_KEY = 'stuzen:upcoming-tasks'

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage)
}

export function loadTasks(): StudentTask[] {
  if (!canUseStorage()) {
    return []
  }

  try {
    const rawTasks = window.localStorage.getItem(STORAGE_KEY)
    if (!rawTasks) {
      return []
    }

    const parsedTasks = JSON.parse(rawTasks)
    return Array.isArray(parsedTasks) ? parsedTasks : []
  } catch {
    return []
  }
}

export function saveTasks(tasks: StudentTask[]) {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}
