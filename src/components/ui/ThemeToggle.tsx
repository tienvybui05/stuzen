export type ThemeMode = 'dark' | 'light'

type ThemeToggleProps = {
  onToggle: () => void
  theme: ThemeMode
}

export function ThemeToggle({ onToggle, theme }: ThemeToggleProps) {
  const isDark = theme === 'dark'

  return (
    <button
      aria-label="Toggle theme"
      className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-2 py-2 text-sm font-semibold text-zinc-200 shadow-lg shadow-black/10 transition hover:border-cyan-200/30 hover:bg-white/[0.1] hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-300/70 focus:ring-offset-2 focus:ring-offset-zinc-950"
      onClick={onToggle}
      type="button"
    >
      <span className="relative h-5 w-9 rounded-full bg-zinc-950/80 ring-1 ring-white/10">
        <span
          className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-cyan-300 shadow-sm transition ${
            isDark ? 'left-1' : 'left-4'
          }`}
        />
      </span>
      <span className="hidden sm:inline">{isDark ? 'Dark' : 'Light'}</span>
    </button>
  )
}
