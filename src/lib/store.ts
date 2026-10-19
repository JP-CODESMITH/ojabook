import { useSyncExternalStore } from 'react'

/* ==========================================================================
   Ojabook data layer
   --------------------------------------------------------------------------
   Everything that reads or writes stored records lives here. Components use
   the exported hooks/functions only, so the storage backend (localStorage
   today, SQLite-in-the-browser later) can be swapped in this one file.

   Storage key and record shape are kept compatible with the legacy vanilla
   app so existing user data loads unchanged.
   ========================================================================== */

export const STORAGE_KEY = 'ledger.v1'

export type RecType = 'sale' | 'exp'

export interface Payment {
  date: string
  amount: number
}

/** A single ledger record. `paid` is only meaningful for sales. */
export interface Rec {
  id: string
  type: RecType
  date: string
  item: string
  amount: number
  paid: number
  cust?: string
  cat?: string
  payments?: Payment[]
}

export interface Ledger {
  biz: string
  recs: Rec[]
}

export type Range = 'today' | 'week' | 'month' | 'all'

export const RANGES: ReadonlyArray<{ value: Range; label: string }> = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This week' },
  { value: 'month', label: 'This month' },
  { value: 'all', label: 'All time' },
]

export const CATEGORIES = [
  'Stock / goods',
  'Transport',
  'Labour',
  'Feed / seed / fertilizer',
  'Rent',
  'Other',
] as const

/* ---------------------------------------------------------------- helpers */

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

export function today(): string {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 10)
}

export function naira(n: number): string {
  return '\u20a6' + Math.round(n).toLocaleString('en-NG')
}

/** Money still owed on a record (sales only). */
export function owed(r: Rec): number {
  return r.type === 'sale' ? Math.max(0, r.amount - r.paid) : 0
}

export function inRange(r: Rec, range: Range): boolean {
  if (range === 'all') return true
  const t = new Date(r.date + 'T00:00:00')
  const n = new Date(today() + 'T00:00:00')
  const days = (n.getTime() - t.getTime()) / 864e5
  if (range === 'today') return days === 0
  if (range === 'week') return days >= 0 && days < 7
  if (range === 'month') {
    return t.getFullYear() === n.getFullYear() && t.getMonth() === n.getMonth()
  }
  return true
}

export function sortRecs(recs: Rec[]): Rec[] {
  return [...recs].sort(
    (a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id),
  )
}

export interface Summary {
  sales: number
  expenses: number
  profit: number
  owed: number
}

export function summarize(recs: Rec[], range: Range): Summary {
  const rows = recs.filter((r) => inRange(r, range))
  const sales = rows
    .filter((r) => r.type === 'sale')
    .reduce((a, r) => a + r.amount, 0)
  const expenses = rows
    .filter((r) => r.type === 'exp')
    .reduce((a, r) => a + r.amount, 0)
  const owedTotal = recs.reduce((a, r) => a + owed(r), 0)
  return { sales, expenses, profit: sales - expenses, owed: owedTotal }
}

export interface DebtGroup {
  name: string
  recs: Rec[]
  total: number
}

export function groupDebts(recs: Rec[]): DebtGroup[] {
  const by = new Map<string, Rec[]>()
  for (const r of recs) {
    if (owed(r) > 0) {
      const name = r.cust || 'Unnamed'
      const list = by.get(name) ?? []
      list.push(r)
      by.set(name, list)
    }
  }
  return [...by.entries()]
    .map(([name, list]) => ({
      name,
      recs: list,
      total: list.reduce((a, r) => a + owed(r), 0),
    }))
    .sort((a, b) => b.total - a.total)
}

/** Apply a payment across a customer's debts, oldest first. */
export function allocatePayment(
  recs: Rec[],
  name: string,
  amount: number,
): Rec[] {
  const list = recs
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
  return recs.map((r) => updates.get(r.id) ?? r)
}

/* -------------------------------------------------------- export / import */

export function toCsv(recs: Rec[]): string {
  const q = (s: unknown) => '"' + String(s ?? '').replace(/"/g, '""') + '"'
  const lines = ['Date,Type,Item,Amount,Paid,Owed,Customer,Category']
  ;[...recs]
    .sort((a, b) => a.date.localeCompare(b.date))
    .forEach((r) =>
      lines.push(
        [
          r.date,
          r.type === 'sale' ? 'Sale' : 'Expense',
          q(r.item),
          r.amount,
          r.type === 'sale' ? r.paid : '',
          owed(r),
          q(r.cust),
          q(r.cat),
        ].join(','),
      ),
    )
  return lines.join('\n')
}

export function parseBackup(text: string): Ledger {
  const data: unknown = JSON.parse(text)
  if (!data || typeof data !== 'object' || !Array.isArray((data as Ledger).recs)) {
    throw new Error('That file is not a valid Ojabook backup.')
  }
  return normalizeLedger(data)
}

export function downloadText(
  filename: string,
  text: string,
  mime: string,
): void {
  const url = URL.createObjectURL(new Blob([text], { type: mime }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function downloadCsv(recs: Rec[]): void {
  downloadText(`ojabook-${today()}.csv`, toCsv(recs), 'text/csv')
}

export function downloadBackup(ledger: Ledger): void {
  downloadText(
    `ojabook-backup-${today()}.json`,
    JSON.stringify(ledger),
    'application/json',
  )
}

export function readBackupFile(file: File): Promise<Ledger> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        resolve(parseBackup(String(reader.result)))
      } catch (err) {
        reject(err instanceof Error ? err : new Error('Invalid backup'))
      }
    }
    reader.onerror = () => reject(new Error('Could not read that file.'))
    reader.readAsText(file)
  })
}

/* -------------------------------------------------------------- normalize */

function emptyLedger(): Ledger {
  return { biz: '', recs: [] }
}

function normalizeRec(value: unknown): Rec | null {
  if (!value || typeof value !== 'object') return null
  const v = value as Record<string, unknown>
  if (v.type !== 'sale' && v.type !== 'exp') return null
  const amount = Number(v.amount)
  if (!Number.isFinite(amount)) return null
  const paid =
    v.type === 'sale' && Number.isFinite(Number(v.paid))
      ? Number(v.paid)
      : amount
  const rec: Rec = {
    id: typeof v.id === 'string' && v.id ? v.id : uid(),
    type: v.type,
    date: typeof v.date === 'string' ? v.date : today(),
    item: typeof v.item === 'string' ? v.item : '',
    amount,
    paid,
  }
  if (typeof v.cust === 'string' && v.cust) rec.cust = v.cust
  if (typeof v.cat === 'string' && v.cat) rec.cat = v.cat
  if (Array.isArray(v.payments)) {
    rec.payments = v.payments
      .map((p) => {
        const pay = p as Record<string, unknown>
        return {
          date: typeof pay.date === 'string' ? pay.date : today(),
          amount: Number(pay.amount) || 0,
        }
      })
      .filter((p) => p.amount > 0)
  }
  return rec
}

function normalizeLedger(value: unknown): Ledger {
  if (!value || typeof value !== 'object') return emptyLedger()
  const v = value as Record<string, unknown>
  const recs = Array.isArray(v.recs)
    ? v.recs.map(normalizeRec).filter((r): r is Rec => r !== null)
    : []
  return { biz: typeof v.biz === 'string' ? v.biz : '', recs }
}

/* ------------------------------------------------------------- local store */

interface Snapshot {
  ledger: Ledger
  ready: boolean
  /** True when the last write failed (e.g. storage full). */
  storageError: boolean
}

const SERVER_SNAPSHOT: Snapshot = {
  ledger: emptyLedger(),
  ready: false,
  storageError: false,
}

let snapshot: Snapshot = SERVER_SNAPSHOT
const listeners = new Set<() => void>()
let hydrated = false

function emit(): void {
  for (const listener of listeners) listener()
}

function readStorage(): { ledger: Ledger; storageError: boolean } {
  if (typeof window === 'undefined') {
    return { ledger: emptyLedger(), storageError: false }
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ledger: emptyLedger(), storageError: false }
    return { ledger: normalizeLedger(JSON.parse(raw)), storageError: false }
  } catch {
    // Corrupt JSON: start clean rather than crash.
    return { ledger: emptyLedger(), storageError: false }
  }
}

function writeStorage(ledger: Ledger): boolean {
  if (typeof window === 'undefined') return true
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ledger))
    return true
  } catch {
    return false
  }
}

function hydrate(): void {
  if (hydrated) return
  hydrated = true
  const { ledger, storageError } = readStorage()
  snapshot = { ledger, ready: true, storageError }
  emit()
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  hydrate()
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot(): Snapshot {
  return snapshot
}

function getServerSnapshot(): Snapshot {
  return SERVER_SNAPSHOT
}

function commit(next: Ledger): void {
  const ok = writeStorage(next)
  snapshot = { ledger: next, ready: snapshot.ready, storageError: !ok }
  emit()
}

/* ------------------------------------------------------------------ hooks */

export interface LedgerStore extends Snapshot {
  addRecord: (rec: Rec) => void
  updateRecord: (rec: Rec) => void
  deleteRecord: (id: string) => void
  setBiz: (biz: string) => void
  payDebt: (name: string, amount: number) => void
  replaceAll: (ledger: Ledger) => void
}

export function useLedger(): LedgerStore {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  return {
    ledger: snap.ledger,
    ready: snap.ready,
    storageError: snap.storageError,
    addRecord: (rec) =>
      commit({ ...snapshot.ledger, recs: [...snapshot.ledger.recs, rec] }),
    updateRecord: (rec) =>
      commit({
        ...snapshot.ledger,
        recs: snapshot.ledger.recs.map((r) => (r.id === rec.id ? rec : r)),
      }),
    deleteRecord: (id) =>
      commit({
        ...snapshot.ledger,
        recs: snapshot.ledger.recs.filter((r) => r.id !== id),
      }),
    setBiz: (biz) => commit({ ...snapshot.ledger, biz }),
    payDebt: (name, amount) =>
      commit({
        ...snapshot.ledger,
        recs: allocatePayment(snapshot.ledger.recs, name, amount),
      }),
    replaceAll: (ledger) => commit(normalizeLedger(ledger)),
  }
}
