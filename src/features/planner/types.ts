export type CourseFormValues = {
  credits: string
  expectedGrade: string
  name: string
}

export type CourseFormErrors = Partial<Record<keyof CourseFormValues, string>>

export type PlannedCourse = {
  credits: number
  expectedGrade: number
  id: string
  name: string
}
