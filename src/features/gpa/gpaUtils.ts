import type {
  GpaCalculationSnapshot,
  GpaFormErrors,
  GpaFormValues,
  GpaResult,
} from './types'

export const initialGpaValues: GpaFormValues = {
  currentGpa: '',
  completedCredits: '',
  remainingCredits: '',
  targetGpa: '',
}

function toNumber(value: string) {
  return Number(value)
}

export function validateGpaForm(values: GpaFormValues) {
  const nextErrors: GpaFormErrors = {}
  const currentGpa = toNumber(values.currentGpa)
  const completedCredits = toNumber(values.completedCredits)
  const remainingCredits = toNumber(values.remainingCredits)
  const targetGpa = toNumber(values.targetGpa)

  if (values.currentGpa === '' || Number.isNaN(currentGpa)) {
    nextErrors.currentGpa = 'Nhập GPA hiện tại.'
  } else if (currentGpa < 0 || currentGpa > 4) {
    nextErrors.currentGpa = 'GPA phải nằm trong khoảng 0 - 4.'
  }

  if (values.completedCredits === '' || Number.isNaN(completedCredits)) {
    nextErrors.completedCredits = 'Nhập số tín chỉ đã học.'
  } else if (completedCredits < 0) {
    nextErrors.completedCredits = 'Số tín chỉ đã học không được âm.'
  }

  if (values.remainingCredits === '' || Number.isNaN(remainingCredits)) {
    nextErrors.remainingCredits = 'Nhập số tín chỉ còn lại.'
  } else if (remainingCredits <= 0) {
    nextErrors.remainingCredits = 'Số tín chỉ còn lại phải lớn hơn 0.'
  }

  if (values.targetGpa === '' || Number.isNaN(targetGpa)) {
    nextErrors.targetGpa = 'Nhập GPA mục tiêu.'
  } else if (targetGpa < 0 || targetGpa > 4) {
    nextErrors.targetGpa = 'GPA mục tiêu phải nằm trong khoảng 0 - 4.'
  }

  return nextErrors
}

export function calculateRequiredGpa(values: GpaFormValues): GpaResult {
  const currentGPA = toNumber(values.currentGpa)
  const completedCredits = toNumber(values.completedCredits)
  const remainingCredits = toNumber(values.remainingCredits)
  const targetGPA = toNumber(values.targetGpa)
  const totalCredits = completedCredits + remainingCredits
  const requiredGPA =
    (targetGPA * totalCredits - currentGPA * completedCredits) /
    remainingCredits

  if (requiredGPA > 4) {
    return {
      requiredGpa: requiredGPA,
      status: 'impossible',
      message: 'Mục tiêu này vượt quá mức GPA tối đa 4.0 ở các tín chỉ còn lại.',
    }
  }

  if (requiredGPA >= 3.6) {
    return {
      requiredGpa: requiredGPA,
      status: 'difficult',
      message: 'Bạn cần duy trì điểm số rất cao ở các học phần còn lại.',
    }
  }

  return {
    requiredGpa: Math.max(requiredGPA, 0),
    status: 'feasible',
    message: 'Mục tiêu này có thể đạt được nếu giữ tiến độ học tập ổn định.',
  }
}

export function createGpaSnapshot(
  values: GpaFormValues,
  result: NonNullable<GpaResult>,
): GpaCalculationSnapshot {
  const completedCredits = toNumber(values.completedCredits)
  const remainingCredits = toNumber(values.remainingCredits)

  return {
    completedCredits,
    currentGpa: toNumber(values.currentGpa),
    remainingCredits,
    requiredGpa: result.requiredGpa,
    status: result.status,
    targetGpa: toNumber(values.targetGpa),
    totalCredits: completedCredits + remainingCredits,
  }
}
