import type { FormEvent } from 'react'
import { Button } from '../../components/ui/Button'
import { NumberInput } from '../../components/ui/NumberInput'
import type { GpaFormErrors, GpaFormValues } from './types'

type GpaFormProps = {
  errors: GpaFormErrors
  onChange: (field: keyof GpaFormValues, value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  values: GpaFormValues
}

export function GpaForm({ errors, onChange, onSubmit, values }: GpaFormProps) {
  return (
    <form className="space-y-5" onSubmit={onSubmit} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberInput
          error={errors.currentGpa}
          label="GPA hiện tại"
          min="0"
          max="4"
          step="0.01"
          placeholder="3.20"
          value={values.currentGpa}
          onChange={(value) => onChange('currentGpa', value)}
        />
        <NumberInput
          error={errors.completedCredits}
          label="Tín chỉ đã học"
          min="0"
          step="1"
          placeholder="72"
          value={values.completedCredits}
          onChange={(value) => onChange('completedCredits', value)}
        />
        <NumberInput
          error={errors.remainingCredits}
          label="Tín chỉ còn lại"
          min="1"
          step="1"
          placeholder="48"
          value={values.remainingCredits}
          onChange={(value) => onChange('remainingCredits', value)}
        />
        <NumberInput
          error={errors.targetGpa}
          label="GPA mục tiêu"
          min="0"
          max="4"
          step="0.01"
          placeholder="3.50"
          value={values.targetGpa}
          onChange={(value) => onChange('targetGpa', value)}
        />
      </div>

      <Button className="w-full" type="submit">
        Tính toán
      </Button>
    </form>
  )
}
