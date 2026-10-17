import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { owed, today, type Ledger, type Rec } from './ledger'

const KEY = 'ledger.v1'

const empty = (): Ledger => ({ biz: '', recs: [] })

function load(): Ledger {
  try {
    const raw = window.localStorage.getItem(KEY)
    const parsed = raw ? JSON.parse(raw) : null
    if (parsed && Array.isArray(parsed.recs)) {
      return {
        biz: typeof parsed.biz === 'string' ? parsed.biz : '',
        recs: parsed.recs as Rec[],
      }
    }
  } catch {
    // fall through to empty ledger
  }
  return empty()
}

type LedgerContextValue = {
  ledger: Ledger
  ready: boolean
  addRecord: (rec: Rec) => void
  deleteRecord: (id: string) => void
  payDebt: (name: string, amount: number) => void
  setBiz: (biz: string) => void
  replaceAll: (ledger: Ledger) => void
}

const LedgerContext = createContext<LedgerContextValue | null>(null)

export function LedgerProvider({ children }: { children: ReactNode }) {
  const [ledger, setLedger] = useState<Ledger>(empty)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setLedger(load())
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      window.localStorage.setItem(KEY, JSON.stringify(ledger))
    } catch {
      window.alert('Could not save. Phone storage may be full.')
    }
  }, [ledger, ready])

  const addRecord = useCallback((rec: Rec) => {
    setLedger((prev) => ({ ...prev, recs: [...prev.recs, rec] }))
  }, [])

  const deleteRecord = useCallback((id: string) => {
    setLedger((prev) => ({
      ...prev,
      recs: prev.recs.filter((r) => r.id !== id),
    }))
  }, [])

  const setBiz = useCallback((biz: string) => {
    setLedger((prev) => ({ ...prev, biz }))
  }, [])

  const replaceAll = useCallback((next: Ledger) => setLedger(next), [])

  // Pay oldest debts first, matching the original behaviour.
  const payDebt = useCallback((name: string, amount: number) => {
    setLedger((prev) => {
      const list = prev.recs
        .filter((r) => owed(r) > 0 && (r.cust || 'Unnamed') === name)
        .sort((a, b) => a.date.localeCompare(b.date))

      let remaining = amount
      const updates = new Map<string, Rec>()
      for (const r of list) {
        if (remaining <= 0) break
        const take = Math.min(remaining, owed(r))
        remaining -= take
        updates.set(r.id, {
          ...r,
          paid: r.paid + take,
          payments: [...(r.payments ?? []), { date: today(), amount: take }],
        })
      }

      return {
        ...prev,
        recs: prev.recs.map((r) => updates.get(r.id) ?? r),
      }
    })
  }, [])

  const value: LedgerContextValue = {
    ledger,
    ready,
    addRecord,
    deleteRecord,
    payDebt,
    setBiz,
    replaceAll,
  }

  return (
    <LedgerContext.Provider value={value}>{children}</LedgerContext.Provider>
  )
}

export function useLedger(): LedgerContextValue {
  const ctx = useContext(LedgerContext)
  if (!ctx) {
    throw new Error('useLedger must be used within a LedgerProvider')
  }
  return ctx
}
