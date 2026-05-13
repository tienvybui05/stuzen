import { Input } from './Input'

type NumberInputProps = {
  error?: string
  label: string
  max?: string
  min: string
  onChange: (value: string) => void
  placeholder: string
  step: string
  value: string
}

export function NumberInput({
  error,
  label,
  max,
  min,
  onChange,
  placeholder,
  step,
  value,
}: NumberInputProps) {
  return (
    <Input
      error={error}
      inputMode="decimal"
      label={label}
      max={max}
      min={min}
      onValueChange={onChange}
      placeholder={placeholder}
      step={step}
      type="number"
      value={value}
    />
  )
}
