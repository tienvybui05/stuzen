import type { PlannedCourse } from './types'

const STORAGE_KEY = 'stuzen:semester-courses'

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage)
}

export function loadPlannedCourses(): PlannedCourse[] {
  if (!canUseStorage()) {
    return []
  }

  try {
    const rawCourses = window.localStorage.getItem(STORAGE_KEY)
    if (!rawCourses) {
      return []
    }

    const parsedCourses = JSON.parse(rawCourses)
    return Array.isArray(parsedCourses) ? parsedCourses : []
  } catch {
    return []
  }
}

export function savePlannedCourses(courses: PlannedCourse[]) {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(courses))
}
