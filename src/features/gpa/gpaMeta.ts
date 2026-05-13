import type { GpaStatus } from './types'

export const statusMeta: Record<
  GpaStatus,
  {
    className: string
    label: string
  }
> = {
  feasible: {
    label: 'Khả thi',
    className: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200',
  },
  difficult: {
    label: 'Khó',
    className: 'border-amber-400/40 bg-amber-400/10 text-amber-200',
  },
  impossible: {
    label: 'Không khả thi',
    className: 'border-rose-400/40 bg-rose-400/10 text-rose-200',
  },
}
