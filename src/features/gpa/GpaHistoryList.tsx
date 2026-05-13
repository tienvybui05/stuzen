import { Button } from '../../components/ui/Button'
import type { SavedGpaResult } from '../../lib/firebase'
import { statusMeta } from './gpaMeta'
import type { GpaHistoryEntry } from './types'

type HistoryItem = GpaHistoryEntry | SavedGpaResult

type GpaHistoryListProps = {
  history: HistoryItem[]
  mode: 'cloud' | 'guest'
  onDelete: (historyId: string) => void
}

function formatDate(value: unknown) {
  if (typeof value === 'string') {
    return new Intl.DateTimeFormat('vi-VN', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(value))
  }

  if (
    value &&
    typeof value === 'object' &&
    'toDate' in value &&
    typeof value.toDate === 'function'
  ) {
    return new Intl.DateTimeFormat('vi-VN', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(value.toDate())
  }

  return 'Chưa có thời gian'
}

export function GpaHistoryList({ history, mode, onDelete }: GpaHistoryListProps) {
  const isCloudMode = mode === 'cloud'

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {isCloudMode ? 'Lịch sử GPA đã lưu' : 'Lịch sử GPA'}
          </h3>
          <p className="mt-1 text-sm text-zinc-400">
            {isCloudMode
              ? 'Dữ liệu được lưu trong Firestore theo tài khoản của bạn.'
              : 'Đăng nhập để lưu và xem lịch sử GPA trên tài khoản của bạn.'}
          </p>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
          {isCloudMode ? `${history.length}/20` : 0}
        </span>
      </div>

      {history.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-4 text-sm leading-6 text-zinc-400">
          {isCloudMode
            ? 'Chưa có kết quả đã lưu. Bấm “Lưu kết quả” sau khi tính GPA.'
            : 'Guest không lưu lịch sử. Hãy đăng nhập rồi bấm “Lưu kết quả”.'}
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <article
              className="rounded-2xl border border-white/10 bg-black/20 p-4"
              key={item.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Cần đạt {item.requiredGpa.toFixed(2)}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {formatDate(item.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusMeta[item.status].className}`}
                  >
                    {statusMeta[item.status].label}
                  </span>
                  <Button
                    className="rounded-full px-3 py-1 text-xs"
                    onClick={() => onDelete(item.id)}
                    variant="danger"
                  >
                    Xóa
                  </Button>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-zinc-400">
                <span>Hiện tại: {item.currentGpa.toFixed(2)}</span>
                <span>Mục tiêu: {item.targetGpa.toFixed(2)}</span>
                <span>
                  Tín chỉ: {item.completedCredits}/{item.totalCredits}
                </span>
              </div>
              {'note' in item && item.note && (
                <p className="mt-3 text-xs text-zinc-400">Ghi chú: {item.note}</p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
