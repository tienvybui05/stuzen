import type { InputHTMLAttributes } from 'react'

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  error?: string
  label: string
  onValueChange: (value: string) => void
}

export function Input({
  error,
  label,
  onValueChange,
  ...props
}: InputProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-zinc-200">{label}</span>
      <input
        className={`mt-2 w-full rounded-2xl border bg-zinc-950/70 px-4 py-3 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20 ${
          error ? 'border-rose-400/70' : 'border-white/10'
        }`}
        onChange={(event) => onValueChange(event.target.value)}
        {...props}
      />
      {error && <span className="mt-2 block text-sm text-rose-300">{error}</span>}
    </label>
  )
}
