import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { NumberInput } from '../../components/ui/NumberInput'
import {
  calculateSemesterCredits,
  calculateSemesterGpa,
  createPlannedCourse,
  initialCourseValues,
  validateCourseForm,
} from './plannerUtils'
import { loadPlannedCourses, savePlannedCourses } from './plannerStorage'
import type {
  CourseFormErrors,
  CourseFormValues,
  PlannedCourse,
} from './types'

export function SemesterPlanner() {
  const [values, setValues] = useState<CourseFormValues>(initialCourseValues)
  const [errors, setErrors] = useState<CourseFormErrors>({})
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null)
  const [courses, setCourses] = useState<PlannedCourse[]>(() =>
    loadPlannedCourses(),
  )

  const totalCredits = useMemo(() => calculateSemesterCredits(courses), [courses])
  const semesterGpa = useMemo(() => calculateSemesterGpa(courses), [courses])

  function handleChange(field: keyof CourseFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateCourseForm(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setCourses((current) => {
      const nextCourses = editingCourseId
        ? current.map((course) =>
            course.id === editingCourseId
              ? {
                  ...course,
                  credits: Number(values.credits),
                  expectedGrade: Number(values.expectedGrade),
                  name: values.name.trim(),
                }
              : course,
          )
        : [...current, createPlannedCourse(values)]
      savePlannedCourses(nextCourses)
      return nextCourses
    })
    setValues(initialCourseValues)
    setEditingCourseId(null)
  }

  function removeCourse(courseId: string) {
    setCourses((current) => {
      const nextCourses = current.filter((course) => course.id !== courseId)
      savePlannedCourses(nextCourses)
      return nextCourses
    })

    if (editingCourseId === courseId) {
      setEditingCourseId(null)
      setValues(initialCourseValues)
      setErrors({})
    }
  }

  function editCourse(course: PlannedCourse) {
    setEditingCourseId(course.id)
    setErrors({})
    setValues({
      credits: String(course.credits),
      expectedGrade: String(course.expectedGrade),
      name: course.name,
    })
  }

  function cancelEdit() {
    setEditingCourseId(null)
    setErrors({})
    setValues(initialCourseValues)
  }

  return (
    <Card
      title="Semester planner"
      description="Thêm môn học, tín chỉ và điểm dự kiến để tính GPA học kỳ."
    >
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <Input
            error={errors.name}
            label="Tên môn học"
            onValueChange={(value) => handleChange('name', value)}
            placeholder="Ví dụ: Cấu trúc dữ liệu"
            type="text"
            value={values.name}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <NumberInput
              error={errors.credits}
              label="Số tín chỉ"
              min="1"
              step="1"
              placeholder="3"
              value={values.credits}
              onChange={(value) => handleChange('credits', value)}
            />
            <NumberInput
              error={errors.expectedGrade}
              label="Điểm dự kiến"
              min="0"
              max="4"
              step="0.01"
              placeholder="3.50"
              value={values.expectedGrade}
              onChange={(value) => handleChange('expectedGrade', value)}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="w-full" type="submit">
              {editingCourseId ? 'Cập nhật môn học' : 'Thêm môn học'}
            </Button>
            {editingCourseId && (
              <Button className="w-full" onClick={cancelEdit} variant="secondary">
                Hủy sửa
              </Button>
            )}
          </div>
        </form>

        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <SummaryCard label="Tổng tín chỉ" value={String(totalCredits)} />
            <SummaryCard
              label="GPA dự kiến"
              value={semesterGpa === null ? '--' : semesterGpa.toFixed(2)}
            />
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-white">Danh sách môn</h3>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
                {courses.length}
              </span>
            </div>

            {courses.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-zinc-400">
                Chưa có môn học. Thêm môn đầu tiên để StuZen tính GPA dự kiến
                cho học kỳ.
              </div>
            ) : (
              <div className="space-y-3">
                {courses.map((course) => (
                  <article
                    className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between"
                    key={course.id}
                  >
                    <div>
                      <p className="font-semibold text-white">{course.name}</p>
                      <p className="mt-1 text-sm text-zinc-400">
                        {course.credits} tín chỉ · điểm dự kiến{' '}
                        {course.expectedGrade.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="rounded-xl px-3 py-2"
                        onClick={() => editCourse(course)}
                        variant="secondary"
                      >
                        Sửa
                      </Button>
                      <Button
                        className="rounded-xl px-3 py-2"
                        onClick={() => removeCourse(course.id)}
                        variant="danger"
                      >
                        Xóa
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

type SummaryCardProps = {
  label: string
  value: string
}

function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="mt-3 text-4xl font-semibold tracking-tight text-white">
        {value}
      </p>
    </div>
  )
}
