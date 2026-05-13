import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { User } from 'firebase/auth'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import {
  deleteTask as deleteCloudTask,
  getTasks,
  saveTask,
  updateTask,
} from '../../lib/firebase'
import {
  createTask,
  getTaskDueState,
  initialTaskValues,
  sortTasksByDeadline,
  validateTaskForm,
} from './taskUtils'
import type {
  StudentTask,
  TaskCategory,
  TaskFormErrors,
  TaskFormValues,
  TaskPriority,
} from './types'

const categories: TaskCategory[] = ['Assignment', 'Exam', 'Project', 'Other']
const priorities: TaskPriority[] = ['Low', 'Medium', 'High']

const dueStateClass = {
  overdue: 'border-rose-400/40 bg-rose-400/10 text-rose-200',
  'due today': 'border-amber-400/40 bg-amber-400/10 text-amber-200',
  upcoming: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200',
}

const priorityClass = {
  Low: 'text-zinc-400',
  Medium: 'text-cyan-200',
  High: 'text-rose-200',
}

type UpcomingTasksProps = {
  user: User | null
}

export function UpcomingTasks({ user }: UpcomingTasksProps) {
  const [values, setValues] = useState<TaskFormValues>(initialTaskValues)
  const [errors, setErrors] = useState<TaskFormErrors>({})
  const [tasks, setTasks] = useState<StudentTask[]>([])
  const [statusMessage, setStatusMessage] = useState('')
  const sortedTasks = useMemo(() => sortTasksByDeadline(tasks), [tasks])

  useEffect(() => {
    if (!user) {
      Promise.resolve().then(() => {
        setTasks([])
        setStatusMessage('Đăng nhập để lưu task vào tài khoản của bạn.')
      })
      return
    }

    getTasks()
      .then((items) => {
        setTasks(items)
        setStatusMessage('')
      })
      .catch((error: unknown) => {
        setStatusMessage(
          error instanceof Error ? error.message : 'Không tải được task đã lưu.',
        )
      })
  }, [user])

  function handleChange(field: keyof TaskFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateTaskForm(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const nextTask = createTask(values)

    if (!user) {
      setStatusMessage('Bạn cần đăng nhập để lưu task.')
      return
    }

    try {
      const cloudId = await saveTask({
        category: nextTask.category,
        createdAt: nextTask.createdAt,
        deadline: nextTask.deadline,
        priority: nextTask.priority,
        status: nextTask.status,
        title: nextTask.title,
      })
      setTasks((current) => [...current, { ...nextTask, id: cloudId }])
      setValues(initialTaskValues)
      setStatusMessage('Đã lưu task lên tài khoản của bạn.')
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : 'Không lưu được task.',
      )
    }
  }

  async function toggleDone(taskId: string) {
    const targetTask = tasks.find((task) => task.id === taskId)
    if (!targetTask) {
      return
    }

    const nextTask: StudentTask = {
      ...targetTask,
      status: targetTask.status === 'done' ? 'pending' : 'done',
    }
    const nextTasks = tasks.map((task) => (task.id === taskId ? nextTask : task))

    if (!user) {
      setStatusMessage('Bạn cần đăng nhập để cập nhật task.')
      return
    }

    try {
      await updateTask(nextTask)
      setTasks(nextTasks)
      setStatusMessage('')
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : 'Không cập nhật được task.',
      )
    }
  }

  async function deleteTask(taskId: string) {
    if (!user) {
      setStatusMessage('Bạn cần đăng nhập để xóa task.')
      return
    }

    try {
      await deleteCloudTask(taskId)
      setTasks((current) => current.filter((task) => task.id !== taskId))
      setStatusMessage('Đã xóa task.')
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : 'Không xóa được task.',
      )
    }
  }

  return (
    <div className="space-y-5">
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <Input
          error={errors.title}
          label="Title"
          onValueChange={(value) => handleChange('title', value)}
          placeholder="Ví dụ: Nộp bài OOP"
          type="text"
          value={values.title}
        />

        <div className="grid gap-3 md:grid-cols-3">
          <Input
            error={errors.deadline}
            label="Deadline"
            onValueChange={(value) => handleChange('deadline', value)}
            type="date"
            value={values.deadline}
          />
          <SelectField
            label="Category"
            onChange={(value) => handleChange('category', value)}
            options={categories}
            value={values.category}
          />
          <SelectField
            label="Priority"
            onChange={(value) => handleChange('priority', value)}
            options={priorities}
            value={values.priority}
          />
        </div>

        <Button className="w-full" type="submit">
          Thêm task
        </Button>
        {statusMessage && (
          <p className="text-sm leading-6 text-cyan-200">{statusMessage}</p>
        )}
      </form>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-white">Danh sách task</p>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
            {tasks.length}
          </span>
        </div>

        {sortedTasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-4 text-sm leading-6 text-zinc-400">
            Chưa có task. Thêm deadline đầu tiên để StuZen sắp xếp theo hạn gần
            nhất.
          </div>
        ) : (
          <div className="max-h-[360px] space-y-3 overflow-y-auto pr-1">
            {sortedTasks.map((task) => {
              const dueState = getTaskDueState(task.deadline)

              return (
                <article
                  className={`rounded-2xl border border-white/10 bg-black/20 p-4 ${
                    task.status === 'done' ? 'opacity-60' : ''
                  }`}
                  key={task.id}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <label className="flex min-w-0 flex-1 items-start gap-3">
                      <input
                        checked={task.status === 'done'}
                        className="mt-1 h-4 w-4 rounded border-white/20 accent-cyan-300"
                        onChange={() => void toggleDone(task.id)}
                        type="checkbox"
                      />
                      <span className="min-w-0">
                        <span
                          className={`block break-words text-sm font-semibold text-white ${
                            task.status === 'done' ? 'line-through' : ''
                          }`}
                        >
                          {task.title}
                        </span>
                        <span className="mt-1 block text-xs text-zinc-400">
                          {task.deadline} · {task.category} ·{' '}
                          <span className={priorityClass[task.priority]}>
                            {task.priority}
                          </span>
                        </span>
                      </span>
                    </label>

                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${dueStateClass[dueState]}`}
                      >
                        {dueState}
                      </span>
                      <Button
                        className="rounded-full px-3 py-1 text-xs"
                        onClick={() => void deleteTask(task.id)}
                        variant="danger"
                      >
                        Xóa
                      </Button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

type SelectFieldProps<T extends string> = {
  label: string
  onChange: (value: T) => void
  options: T[]
  value: T
}

function SelectField<T extends string>({
  label,
  onChange,
  options,
  value,
}: SelectFieldProps<T>) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-zinc-200">{label}</span>
      <select
        className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-base text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
        onChange={(event) => onChange(event.target.value as T)}
        value={value}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}
