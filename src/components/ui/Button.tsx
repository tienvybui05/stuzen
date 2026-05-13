import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  className?: string
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-cyan-300 via-sky-300 to-emerald-300 text-zinc-950 shadow-lg shadow-cyan-950/25 hover:shadow-cyan-500/20 focus:ring-cyan-300 focus:ring-offset-zinc-950',
  secondary:
    'border border-white/10 bg-white/[0.06] text-white shadow-lg shadow-black/10 hover:border-cyan-200/30 hover:bg-white/[0.1] focus:ring-white/30 focus:ring-offset-zinc-950',
  ghost:
    'text-zinc-300 hover:bg-white/[0.08] hover:text-white focus:ring-white/20 focus:ring-offset-zinc-950',
  danger:
    'border border-rose-300/25 bg-rose-400/10 text-rose-100 shadow-lg shadow-rose-950/10 hover:bg-rose-400/18 focus:ring-rose-300 focus:ring-offset-zinc-950',
}

export function Button({
  children,
  className = '',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 ${variantClasses[variant]} ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}
