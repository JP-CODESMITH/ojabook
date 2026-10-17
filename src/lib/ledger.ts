export type RecType = 'sale' | 'exp'

export type Payment = { date: string; amount: number }

// Record: {id, type, date, item, amount, paid, cust, cat, payments[]}
// For sales, paid = amount received so far. Debt = amount - paid.
export type Rec = {
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

export type Ledger = { biz: string; recs: Rec[] }

export type Range = 'today' | 'week' | 'month' | 'all'

export const CATEGORIES = [
  'Stock / goods',
  'Transport',
  'Labour',
  'Feed / seed / fertilizer',
  'Rent',
  'Other',
] as const

export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 6)

export function today(): string {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 10)
}

export function naira(n: number): string {
  return '\u20a6' + Math.round(n).toLocaleString('en-NG')
}

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
    return (
      t.getFullYear() === n.getFullYear() && t.getMonth() === n.getMonth()
    )
  }
  return true
}

export function sortRecs(recs: Rec[]): Rec[] {
  return [...recs].sort(
    (a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id),
  )
}

export function debtTotal(list: Rec[]): number {
  return list.reduce((a, r) => a + owed(r), 0)
}
