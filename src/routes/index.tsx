import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import RecordRow from '../components/RecordRow'
import { inRange, naira, owed, sortRecs, type Range } from '../lib/ledger'
import { useLedger } from '../lib/ledger-store'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const { ledger } = useLedger()
  const [range, setRange] = useState<Range>('month')

  const rows = ledger.recs.filter((r) => inRange(r, range))
  const sales = rows
    .filter((r) => r.type === 'sale')
    .reduce((a, r) => a + r.amount, 0)
  const expenses = rows
    .filter((r) => r.type === 'exp')
    .reduce((a, r) => a + r.amount, 0)
  const profit = sales - expenses
  const totalOwed = ledger.recs.reduce((a, r) => a + owed(r), 0)
  const recent = sortRecs(ledger.recs).slice(0, 5)

  return (
    <main>
      <section>
        <div className="card">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as Range)}
            aria-label="Date range"
          >
            <option value="today">Today</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
            <option value="all">All time</option>
          </select>
          <div className="grid" style={{ marginTop: 12 }}>
            <div className="stat">
              <small>Sales</small>
              <b className="pos">{naira(sales)}</b>
            </div>
            <div className="stat">
              <small>Expenses</small>
              <b className="neg">{naira(expenses)}</b>
            </div>
            <div className="stat">
              <small>Profit</small>
              <b className={profit >= 0 ? 'pos' : 'neg'}>{naira(profit)}</b>
            </div>
            <div className="stat">
              <small>Customers owe you</small>
              <b className="warn">{naira(totalOwed)}</b>
            </div>
          </div>
        </div>

        <div className="card">
          <b>Recent</b>
          {recent.length ? (
            <div>
              {recent.map((r) => (
                <RecordRow key={r.id} rec={r} />
              ))}
            </div>
          ) : (
            <div className="empty">No records yet. Tap Add.</div>
          )}
        </div>
      </section>
    </main>
  )
}
