import { Button } from './Button'
import { ThemeToggle, type ThemeMode } from './ThemeToggle'

type NavbarUser = {
  displayName: string | null
  email: string | null
  photoURL: string | null
}

type NavItem = {
  href: string
  label: string
}

type NavbarProps = {
  brand: string
  ctaHref: string
  ctaLabel: string
  items: NavItem[]
  onLogin: () => void
  onLogout: () => void
  onThemeToggle: () => void
  theme: ThemeMode
  user: NavbarUser | null
}

function GoogleMark() {
  return (
    <span
      aria-hidden="true"
      className="grid h-5 w-5 place-items-center rounded-full bg-white text-xs font-black text-zinc-900 shadow-sm"
    >
      G
    </span>
  )
}

function UserFallback({ name }: { name: string }) {
  return (
    <span className="grid h-9 w-9 place-items-center rounded-full bg-cyan-300 text-sm font-bold text-zinc-950">
      {name.slice(0, 1).toUpperCase()}
    </span>
  )
}

export function Navbar({
  brand,
  ctaHref,
  ctaLabel,
  items,
  onLogin,
  onLogout,
  onThemeToggle,
  theme,
  user,
}: NavbarProps) {
  const userName = user?.displayName || user?.email || 'User'

  return (
    <nav className="sticky top-4 z-30 flex items-center justify-between gap-3 rounded-[1.75rem] border border-white/10 bg-zinc-950/55 px-3 py-3 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:px-4">
      <a className="flex items-center gap-2 text-lg font-semibold tracking-tight text-white" href="#hero">
        <span className="grid h-9 w-9 place-items-center rounded-2xl bg-cyan-300 text-sm font-black text-zinc-950 shadow-lg shadow-cyan-950/20">
          SZ
        </span>
        <span>{brand}</span>
      </a>

      <div className="hidden items-center gap-6 text-sm text-zinc-300 lg:flex">
        {items.map((item) => (
          <a className="transition hover:text-white" href={item.href} key={item.href}>
            {item.label}
          </a>
        ))}
      </div>

      <div className="flex min-w-0 items-center gap-2">
        <ThemeToggle onToggle={onThemeToggle} theme={theme} />
        {user ? (
          <div className="flex min-w-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] p-1 shadow-lg shadow-black/10">
            {user.photoURL ? (
              <img
                alt=""
                className="h-9 w-9 rounded-full ring-2 ring-cyan-300/40"
                referrerPolicy="no-referrer"
                src={user.photoURL}
              />
            ) : (
              <UserFallback name={userName} />
            )}
            <span className="hidden max-w-36 truncate text-sm font-semibold text-white md:block">
              {userName}
            </span>
            <button
              className="rounded-full px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-white/[0.08] hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-300/70"
              onClick={onLogout}
              type="button"
            >
              Logout
            </button>
          </div>
        ) : (
          <Button
            className="rounded-full px-3 py-2 text-xs sm:px-4"
            onClick={onLogin}
            type="button"
          >
            <GoogleMark />
            <span>Login</span>
          </Button>
        )}
        <a
          className="hidden rounded-full border border-cyan-200/30 bg-cyan-300/90 px-4 py-2 text-sm font-semibold text-zinc-950 shadow-lg shadow-cyan-950/20 transition hover:-translate-y-0.5 hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-zinc-950 sm:inline-flex"
          href={ctaHref}
        >
          {ctaLabel}
        </a>
      </div>
    </nav>
  )
}
