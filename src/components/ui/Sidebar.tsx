import type { ReactNode } from 'react'

type SidebarItem = {
  href: string
  label: string
}

type SidebarProps = {
  actions?: ReactNode
  brand: string
  items: SidebarItem[]
}

export function Sidebar({ actions, brand, items }: SidebarProps) {
  return (
    <aside className="rounded-3xl border border-white/10 bg-zinc-900/75 p-4 shadow-xl shadow-black/20 backdrop-blur-xl">
      <p className="px-3 text-lg font-semibold tracking-tight text-white">{brand}</p>
      <nav className="mt-5 grid gap-1">
        {items.map((item) => (
          <a
            className="rounded-2xl px-3 py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
            href={item.href}
            key={item.href}
          >
            {item.label}
          </a>
        ))}
      </nav>
      {actions && <div className="mt-5 border-t border-white/10 pt-4">{actions}</div>}
    </aside>
  )
}
