import { createFileRoute } from '@tanstack/react-router'
import { groupDebts, naira, useLedger } from '../lib/store'

export const Route = createFileRoute('/app/debts')({
  component: Debts,
})

function Debts() {
  const { ledger, payDebt } = useLedger()
  const groups = groupDebts(ledger.recs)

  function onPay(name: string, total: number) {
    const input = prompt(
      `${name} owes ${naira(total)}. How much did they pay?`,
    )
    if (input === null) return
    const value = parseFloat(input)
    if (!(value > 0)) {
      alert('Enter a valid amount.')
      return
    }
    if (value > total) {
      alert('That is more than they owe.')
      return
    }
    payDebt(name, value)
  }

  return (
    <div className="card">
      <span className="card-title">Who owes you</span>
      {groups.length ? (
        <div>
          {groups.map((g) => (
            <div className="row" key={g.name}>
              <div className="l">
                <b>{g.name}</b>
                <small>
                  {g.recs.length} {g.recs.length === 1 ? 'sale' : 'sales'}
                </small>
              </div>
              <div className="r">
                <span className="amt warn">{naira(g.total)}</span>
                <br />
                <button
                  type="button"
                  className="btn-inline"
                  onClick={() => onPay(g.name, g.total)}
                >
                  Got payment
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty">No one owes you right now.</div>
      )}
    </div>
  )
}
