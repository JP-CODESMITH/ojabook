import { createFileRoute } from '@tanstack/react-router'
import { debtTotal, naira, owed, type Rec } from '../lib/ledger'
import { useLedger } from '../lib/ledger-store'

export const Route = createFileRoute('/debts')({ component: Debts })

function Debts() {
  const { ledger, payDebt } = useLedger()

  const by: Record<string, Rec[]> = {}
  for (const r of ledger.recs) {
    if (owed(r) > 0) {
      const name = r.cust || 'Unnamed'
      ;(by[name] ||= []).push(r)
    }
  }
  const names = Object.keys(by).sort((a, b) => debtTotal(by[b]) - debtTotal(by[a]))

  function onPay(name: string) {
    const total = debtTotal(by[name])
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
    <main>
      <section>
        <div className="card">
          <b>Who owes you</b>
          {names.length ? (
            <div>
              {names.map((n) => (
                <div className="row" key={n}>
                  <div className="l">
                    <b>{n}</b>
                    <small>{by[n].length} sale(s)</small>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <b className="warn">{naira(debtTotal(by[n]))}</b>
                    <br />
                    <button
                      type="button"
                      className="small"
                      onClick={() => onPay(n)}
                    >
                      Got payment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty">No one owes you. 🎉</div>
          )}
        </div>
      </section>
    </main>
  )
}
