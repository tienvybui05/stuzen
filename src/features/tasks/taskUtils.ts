import type {
  StudentTask,
  TaskDueState,
  TaskFormErrors,
  TaskFormValues,
} from './types'

export const initialTaskValues: TaskFormValues = {
  category: 'Assignment',
  deadline: '',
  priority: 'Medium',
  title: '',
}

function getTodayDateString() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const date = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${date}`
}

export function validateTaskForm(values: TaskFormValues) {
  const errors: TaskFormErrors = {}

  if (values.title.trim() === '') {
    errors.title = 'Nhập tên task.'
  }

  if (values.deadline === '') {
    errors.deadline = 'Chọn deadline.'
  }

  return errors
}

export function createTask(values: TaskFormValues): StudentTask {
  return {
    ...values,
    createdAt: new Date().toISOString(),
    id: crypto.randomUUID(),
    status: 'pending',
    title: values.title.trim(),
  }
}

export function getTaskDueState(deadline: string): TaskDueState {
  const today = getTodayDateString()

  if (deadline < today) {
    return 'overdue'
  }

  if (deadline === today) {
    return 'due today'
  }

  return 'upcoming'
}

export function sortTasksByDeadline(tasks: StudentTask[]) {
  return [...tasks].sort((a, b) => {
    if (a.deadline !== b.deadline) {
      return a.deadline.localeCompare(b.deadline)
    }

    if (a.status !== b.status) {
      return a.status === 'pending' ? -1 : 1
    }

    return a.createdAt.localeCompare(b.createdAt)
  })
}
