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

  const { sales, collected, expenses, profit, owed } = summarize(
    ledger.recs,
    range,
  )
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
            <small>Cash in</small>
            <b className="pos">{naira(collected)}</b>
            <span className="stat-sub">Billed {naira(sales)}</span>
          </div>
          <div className="stat">
            <small>Expenses</small>
            <b className="neg">{naira(expenses)}</b>
          </div>
          <div className="stat">
            <small>{profit >= 0 ? 'Profit' : 'Loss'}</small>
            <b className={profit >= 0 ? 'pos' : 'neg'}>
              {naira(Math.abs(profit))}
            </b>
          </div>
          <div className="stat">
            <small>Customers owe you</small>
            <b className="warn">{naira(owed)}</b>
            <span className="stat-sub">All time</span>
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
