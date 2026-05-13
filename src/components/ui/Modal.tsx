import type { ReactNode } from 'react'
import { Button } from './Button'

type ModalProps = {
  children: ReactNode
  description?: string
  footer?: ReactNode
  onClose: () => void
  open: boolean
  title: string
}

export function Modal({
  children,
  description,
  footer,
  onClose,
  open,
  title,
}: ModalProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <section className="w-full max-w-lg rounded-3xl border border-white/10 bg-zinc-900 p-5 shadow-2xl shadow-black/40">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            {description && (
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                {description}
              </p>
            )}
          </div>
          <Button className="px-3 py-2" onClick={onClose} variant="ghost">
            Đóng
          </Button>
        </div>
        <div className="mt-5">{children}</div>
        {footer && <div className="mt-5 flex justify-end gap-3">{footer}</div>}
      </section>
    </div>
  )
}
