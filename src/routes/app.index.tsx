import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import RecordRow from '../components/app/RecordRow'
import TrendChart from '../components/app/TrendChart'
import {
  RANGES,
  naira,
  sortRecs,
  summarize,
  useLedger,
  type Range,
} from '../lib/store'

export const Route = createFileRoute('/app/')({
  component: Home,
})

function Home() {
  const { ledger } = useLedger()
  const [range, setRange] = useState<Range>('month')

  const { sales, expenses, profit, owed } = summarize(ledger.recs, range)
  const recent = sortRecs(ledger.recs).slice(0, 5)

  return (
    <>
      <div className="card">
        <div className="field range-select">
          <label htmlFor="range">Show</label>
          <select
            id="range"
            className="select"
            value={range}
            onChange={(e) => setRange(e.target.value as Range)}
          >
            {RANGES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div className="stat-grid">
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
            <b className="warn">{naira(owed)}</b>
          </div>
        </div>
      </div>

      <div className="card">
        <span className="card-title">Recent</span>
        {recent.length ? (
          <div>
            {recent.map((r) => (
              <RecordRow key={r.id} rec={r} />
            ))}
          </div>
        ) : (
          <div className="empty">
            No records yet.{' '}
            <Link to="/app/add">Tap Add to record your first sale.</Link>
          </div>
        )}
      </div>

      <TrendChart recs={ledger.recs} />
    </>
  )
}
