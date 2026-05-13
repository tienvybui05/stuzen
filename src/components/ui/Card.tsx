import type { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
  description?: string
  title: string
}

export function Card({ children, className = '', description, title }: CardProps) {
  return (
    <section
      className={`rounded-3xl border border-white/10 bg-zinc-900/75 p-5 shadow-xl shadow-black/20 backdrop-blur-xl sm:p-6 ${className}`}
    >
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight text-white">{title}</h2>
        {description && (
          <p className="mt-1 text-sm leading-6 text-zinc-400">{description}</p>
        )}
      </div>
      {children}
    </section>
  )
}
