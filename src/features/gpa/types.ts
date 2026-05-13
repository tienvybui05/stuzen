export type GpaFormValues = {
  currentGpa: string
  completedCredits: string
  remainingCredits: string
  targetGpa: string
}

export type GpaFormErrors = Partial<Record<keyof GpaFormValues, string>>

export type GpaStatus = 'feasible' | 'difficult' | 'impossible'

export type GpaResult = {
  requiredGpa: number
  status: GpaStatus
  message: string
} | null

export type GpaCalculationSnapshot = {
  completedCredits: number
  currentGpa: number
  remainingCredits: number
  requiredGpa: number
  status: GpaStatus
  targetGpa: number
  totalCredits: number
}

export type GpaHistoryEntry = GpaCalculationSnapshot & {
  createdAt: string
  id: string
}
