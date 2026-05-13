import type {
  CourseFormErrors,
  CourseFormValues,
  PlannedCourse,
} from './types'

export const initialCourseValues: CourseFormValues = {
  credits: '',
  expectedGrade: '',
  name: '',
}

function toNumber(value: string) {
  return Number(value)
}

export function validateCourseForm(values: CourseFormValues) {
  const errors: CourseFormErrors = {}
  const credits = toNumber(values.credits)
  const expectedGrade = toNumber(values.expectedGrade)

  if (values.name.trim() === '') {
    errors.name = 'Nhập tên môn học.'
  }

  if (values.credits === '' || Number.isNaN(credits)) {
    errors.credits = 'Nhập số tín chỉ.'
  } else if (credits <= 0) {
    errors.credits = 'Số tín chỉ phải lớn hơn 0.'
  }

  if (values.expectedGrade === '' || Number.isNaN(expectedGrade)) {
    errors.expectedGrade = 'Nhập điểm dự kiến.'
  } else if (expectedGrade < 0 || expectedGrade > 4) {
    errors.expectedGrade = 'Điểm dự kiến phải nằm trong khoảng 0 - 4.'
  }

  return errors
}

export function createPlannedCourse(values: CourseFormValues): PlannedCourse {
  return {
    credits: toNumber(values.credits),
    expectedGrade: toNumber(values.expectedGrade),
    id: crypto.randomUUID(),
    name: values.name.trim(),
  }
}

export function calculateSemesterCredits(courses: PlannedCourse[]) {
  return courses.reduce((total, course) => total + course.credits, 0)
}

export function calculateSemesterGpa(courses: PlannedCourse[]) {
  const totalCredits = calculateSemesterCredits(courses)

  if (totalCredits === 0) {
    return null
  }

  const weightedGradePoints = courses.reduce(
    (total, course) => total + course.credits * course.expectedGrade,
    0,
  )

  return weightedGradePoints / totalCredits
}
