import { naira, today, type Rec } from '../../lib/store'

/* ==========================================================================
   TrendChart — a compact 7-day bar chart for the Home screen.
   Sold is shown as a pale bar; profit (or loss) is drawn beside it from the
   same zero line, green when positive and red below the line when negative.
   Pure inline SVG so it stays offline-friendly; a screen-reader table mirrors
   the same numbers.
   ========================================================================== */

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const

const W = 340
const PLOT_TOP = 16
const PLOT_BOTTOM = 176
const LABEL_Y = 195
const PAD_X = 2

interface Day {
  date: string
  label: string
  sold: number
  spent: number
  net: number
  isToday: boolean
}

function ymd(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function buildDays(recs: Rec[], count: number): Day[] {
  const buckets = new Map<string, { sold: number; spent: number }>()
  for (const r of recs) {
    const b = buckets.get(r.date) ?? { sold: 0, spent: 0 }
    if (r.type === 'sale') b.sold += r.amount
    else b.spent += r.amount
    buckets.set(r.date, b)
  }

  const end = new Date(today() + 'T00:00:00')
  const days: Day[] = []
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(end)
    d.setDate(end.getDate() - i)
    const date = ymd(d)
    const b = buckets.get(date) ?? { sold: 0, spent: 0 }
    days.push({
      date,
      label: DAY_LABELS[d.getDay()],
      sold: b.sold,
      spent: b.spent,
      net: b.sold - b.spent,
      isToday: i === 0,
    })
  }
  return days
}

export default function TrendChart({ recs }: { recs: Rec[] }) {
  const days = buildDays(recs, 7)

  const soldTotal = days.reduce((a, d) => a + d.sold, 0)
  const profitTotal = days.reduce((a, d) => a + d.net, 0)
  const hasData = days.some((d) => d.sold > 0 || d.spent > 0)

  const margin = soldTotal > 0 ? Math.round((profitTotal / soldTotal) * 100) : 0
  const isLoss = profitTotal < 0

  const maxUp = Math.max(
    1,
    ...days.map((d) => Math.max(d.sold, Math.max(d.net, 0))),
  )
  const maxDown = Math.max(0, ...days.map((d) => Math.max(-d.net, 0)))
  const scale = (PLOT_BOTTOM - PLOT_TOP) / (maxUp + maxDown)
  const zeroY = PLOT_TOP + maxUp * scale

  const colW = (W - PAD_X * 2) / days.length
  const barW = Math.min(colW * 0.3, 16)

  return (
    <div className="card">
      <span className="card-title">Last 7 days</span>

      {hasData ? (
        <>
          <div className="trend">
            <svg
              viewBox={`0 0 ${W} 210`}
              role="img"
              aria-label={`Bar chart of money sold and profit or loss for each of the last 7 days. Sold over the week ${naira(soldTotal)}, ${isLoss ? 'loss' : 'profit'} ${naira(Math.abs(profitTotal))}.`}
            >
              {days.map((d, i) => {
                const centre = PAD_X + (i + 0.5) * colW
                const soldH = d.sold * scale
                const netH = Math.abs(d.net) * scale
                const soldX = centre - barW - 1
                const netX = centre + 1
                return (
                  <g key={d.date}>
                    {d.isToday && (
                      <rect
                        x={centre - colW / 2 + 2}
                        y={PLOT_TOP - 6}
                        width={colW - 4}
                        height={PLOT_BOTTOM - PLOT_TOP + 12}
                        rx={6}
                        className="trend-today"
                      />
                    )}
                    <rect
                      x={soldX}
                      y={zeroY - soldH}
                      width={barW}
                      height={Math.max(soldH, d.sold > 0 ? 2 : 0)}
                      rx={3}
                      className="trend-sold"
                    />
                    <rect
                      x={netX}
                      y={d.net >= 0 ? zeroY - netH : zeroY}
                      width={barW}
                      height={Math.max(netH, d.net !== 0 ? 2 : 0)}
                      rx={3}
                      className={d.net >= 0 ? 'trend-profit' : 'trend-loss'}
                    />
                  </g>
                )
              })}
              <line
                x1={0}
                y1={zeroY}
                x2={W}
                y2={zeroY}
                className="trend-zero"
              />
              {days.map((d, i) => {
                const centre = PAD_X + (i + 0.5) * colW
                return (
                  <text
                    key={d.date}
                    x={centre}
                    y={LABEL_Y}
                    textAnchor="middle"
                    className={d.isToday ? 'trend-day is-today' : 'trend-day'}
                  >
                    {d.label}
                  </text>
                )
              })}
            </svg>
          </div>

          <div className="trend-legend">
            <span>
              <i className="trend-sold" /> Sold
            </span>
            <span>
              <i className="trend-profit" /> Profit
            </span>
            <span>
              <i className="trend-loss" /> Loss
            </span>
          </div>

          <div className="trend-caption">
            <span>
              Sold this week <b>{naira(soldTotal)}</b>
            </span>
            <span>
              {isLoss ? 'Loss' : 'Profit'}{' '}
              <b className={isLoss ? 'neg' : 'pos'}>
                {naira(Math.abs(profitTotal))}
              </b>
            </span>
            <span>
              {isLoss ? 'Loss' : 'Profit'} margin{' '}
              <b className={isLoss ? 'neg' : 'pos'}>{Math.abs(margin)}%</b>
            </span>
          </div>

          <table className="sr-only">
            <caption>Sold and profit or loss for the last 7 days</caption>
            <thead>
              <tr>
                <th>Day</th>
                <th>Sold</th>
                <th>Profit or loss</th>
              </tr>
            </thead>
            <tbody>
              {days.map((d) => (
                <tr key={d.date}>
                  <th scope="row">{d.date}</th>
                  <td>{naira(d.sold)}</td>
                  <td>
                    {d.net < 0 ? 'loss ' : 'profit '}
                    {naira(Math.abs(d.net))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div className="empty">No sales or expenses in the last 7 days.</div>
      )}
    </div>
  )
}
