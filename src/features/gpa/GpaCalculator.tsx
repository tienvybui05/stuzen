import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { User } from 'firebase/auth'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { GpaForm } from './GpaForm'
import { GpaHistoryList } from './GpaHistoryList'
import { GpaProgressCard } from './GpaProgressCard'
import { GpaResultCard } from './GpaResultCard'
import {
  calculateRequiredGpa,
  createGpaSnapshot,
  initialGpaValues,
  validateGpaForm,
} from './gpaUtils'
import {
  deleteGpaResult,
  getGpaHistory,
  saveGpaResult,
  type SavedGpaResult,
} from '../../lib/firebase'
import type {
  GpaCalculationSnapshot,
  GpaFormErrors,
  GpaFormValues,
  GpaResult,
} from './types'

type GpaCalculatorProps = {
  onCalculate: (snapshot: GpaCalculationSnapshot) => void
  user: User | null
}

export function GpaCalculator({ onCalculate, user }: GpaCalculatorProps) {
  const [values, setValues] = useState<GpaFormValues>(initialGpaValues)
  const [errors, setErrors] = useState<GpaFormErrors>({})
  const [result, setResult] = useState<GpaResult>(null)
  const [latestSnapshot, setLatestSnapshot] =
    useState<GpaCalculationSnapshot | null>(null)
  const [savedHistory, setSavedHistory] = useState<SavedGpaResult[]>([])
  const [note, setNote] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  const completedCredits = Number(values.completedCredits) || 0
  const remainingCredits = Number(values.remainingCredits) || 0
  const totalCredits = completedCredits + remainingCredits
  const progress = useMemo(() => {
    if (totalCredits <= 0) {
      return 0
    }

    return Math.min(100, Math.round((completedCredits / totalCredits) * 100))
  }, [completedCredits, totalCredits])

  useEffect(() => {
    if (!user) {
      Promise.resolve().then(() => {
        setSavedHistory([])
        setLatestSnapshot(null)
        setResult(null)
        setNote('')
        setStatusMessage('')
      })
      return
    }

    getGpaHistory()
      .then((items) => {
        setSavedHistory(items)
        if (items[0]) {
          onCalculate(items[0])
        }
      })
      .catch((error: unknown) => {
        setStatusMessage(
          error instanceof Error ? error.message : 'Không tải được lịch sử đã lưu.',
        )
      })
  }, [onCalculate, user])

  function handleChange(field: keyof GpaFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateGpaForm(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setResult(null)
      return
    }

    const nextResult = calculateRequiredGpa(values)
    setResult(nextResult)

    if (!nextResult) {
      return
    }

    const snapshot = createGpaSnapshot(values, nextResult)
    setLatestSnapshot(snapshot)
    onCalculate(snapshot)
  }

  async function saveCurrentResult() {
    if (!latestSnapshot) {
      setStatusMessage('Hãy tính GPA trước khi lưu kết quả.')
      return
    }

    if (!user) {
      setLoginModalOpen(true)
      return
    }

    try {
      await saveGpaResult({ ...latestSnapshot, note })
      const nextSavedHistory = await getGpaHistory()
      setSavedHistory(nextSavedHistory)
      setNote('')
      setStatusMessage('Đã lưu kết quả GPA.')
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : 'Không lưu được kết quả GPA.',
      )
    }
  }

  async function deleteSavedHistoryItem(historyId: string) {
    try {
      await deleteGpaResult(historyId)
      const nextSavedHistory = await getGpaHistory()
      setSavedHistory(nextSavedHistory)
      setStatusMessage('Đã xóa kết quả đã lưu.')
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : 'Không xóa được kết quả.',
      )
    }
  }

  return (
    <Card
      title="Tính GPA mục tiêu"
      description="Ước tính GPA cần đạt ở các tín chỉ còn lại để chạm mục tiêu."
    >
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <GpaForm
            errors={errors}
            onChange={handleChange}
            onSubmit={handleSubmit}
            values={values}
          />
          <GpaHistoryList
            history={user ? savedHistory : []}
            mode={user ? 'cloud' : 'guest'}
            onDelete={deleteSavedHistoryItem}
          />
        </div>

        <aside className="grid content-start gap-4">
          <GpaResultCard result={result} />
          <div className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">Lưu kết quả</p>
                <p className="mt-1 text-sm text-zinc-400">
                  {user
                    ? `Bạn đã lưu ${savedHistory.length}/20 kết quả`
                    : 'Đăng nhập để lưu kết quả lên Firestore.'}
                </p>
              </div>
              <Button className="shrink-0 px-4 py-2" onClick={saveCurrentResult}>
                Lưu kết quả
              </Button>
            </div>
            <Input
              label="Ghi chú"
              onValueChange={setNote}
              placeholder="Ví dụ: Mục tiêu học kỳ 1"
              type="text"
              value={note}
            />
            {statusMessage && (
              <p className="text-sm leading-6 text-cyan-200">{statusMessage}</p>
            )}
          </div>
          <GpaProgressCard
            completedCredits={completedCredits}
            progress={progress}
            remainingCredits={remainingCredits}
          />
        </aside>
      </div>

      <Modal
        description="Bạn vẫn có thể dùng GPA calculator ở chế độ guest. Đăng nhập chỉ cần khi muốn lưu dữ liệu lên Firestore."
        onClose={() => setLoginModalOpen(false)}
        open={loginModalOpen}
        title="Đăng nhập để lưu kết quả"
      >
        <p className="text-sm leading-6 text-zinc-400">
          Kết quả hiện tại chưa được lưu lên Firestore. Hãy đăng nhập bằng Google,
          sau đó bấm “Lưu kết quả” lại.
        </p>
      </Modal>
    </Card>
  )
}
