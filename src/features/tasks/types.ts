export type TaskCategory = 'Assignment' | 'Exam' | 'Project' | 'Other'

export type TaskPriority = 'Low' | 'Medium' | 'High'

export type TaskStatus = 'pending' | 'done'

export type TaskDueState = 'overdue' | 'due today' | 'upcoming'

export type TaskFormValues = {
  category: TaskCategory
  deadline: string
  priority: TaskPriority
  title: string
}

export type TaskFormErrors = Partial<Record<keyof TaskFormValues, string>>

export type StudentTask = TaskFormValues & {
  createdAt: string
  id: string
  status: TaskStatus
}
