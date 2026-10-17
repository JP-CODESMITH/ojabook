import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { CATEGORIES, today, uid, type Rec, type RecType } from '../lib/ledger'
import { useLedger } from '../lib/ledger-store'

export const Route = createFileRoute('/add')({ component: Add })

type PayMode = 'paid' | 'credit' | 'part'

function Add() {
  const { ledger, addRecord } = useLedger()
  const navigate = useNavigate()

  const [mode, setMode] = useState<RecType>('sale')
  const [item, setItem] = useState('')
  const [amount, setAmount] = useState('')
  const [pay, setPay] = useState<PayMode>('paid')
  const [paidNow, setPaidNow] = useState('')
  const [cust, setCust] = useState('')
  const [cat, setCat] = useState<string>(CATEGORIES[0])
  const [date, setDate] = useState(today)

  const items = [...new Set(ledger.recs.map((r) => r.item))]
  const custs = [...new Set(ledger.recs.map((r) => r.cust).filter(Boolean))]

  function resetForm() {
    setItem('')
    setAmount('')
    setPay('paid')
    setPaidNow('')
    setCust('')
    setCat(CATEGORIES[0])
    setDate(today())
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const value = parseFloat(amount)
    if (!(value > 0)) return

    const rec: Rec = {
      id: uid(),
      type: mode,
      date,
      item: item.trim(),
      amount: value,
      paid: value,
    }

    if (mode === 'sale') {
      if (pay !== 'paid') {
        rec.cust = cust.trim()
        if (!rec.cust) {
          alert('Enter the customer name so you can track the debt.')
          return
        }
        rec.paid =
          pay === 'credit' ? 0 : Math.min(value, parseFloat(paidNow) || 0)
      }
    } else {
      rec.cat = cat
    }

    addRecord(rec)
    resetForm()
    navigate({ to: '/' })
  }

  return (
    <main>
      <section>
        <div className="card">
          <div className="grid">
            <button
              type="button"
              className="sec"
              style={
                mode === 'sale'
                  ? { margin: 0, background: 'var(--g)', color: '#fff' }
                  : { margin: 0 }
              }
              onClick={() => setMode('sale')}
            >
              Sale
            </button>
            <button
              type="button"
              className="sec"
              style={
                mode === 'exp'
                  ? { margin: 0, background: 'var(--r)', color: '#fff' }
                  : { margin: 0 }
              }
              onClick={() => setMode('exp')}
            >
              Expense
            </button>
          </div>

          <form onSubmit={onSubmit}>
            <label htmlFor="item">
              {mode === 'sale'
                ? 'Item sold (e.g. tomatoes, 2 bags rice)'
                : 'What did you spend on?'}
            </label>
            <input
              id="item"
              list="items"
              autoComplete="off"
              required
              value={item}
              onChange={(e) => setItem(e.target.value)}
            />
            <datalist id="items">
              {items.map((i) => (
                <option key={i} value={i} />
              ))}
            </datalist>

            <label htmlFor="amount">Amount (₦)</label>
            <input
              id="amount"
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            {mode === 'sale' ? (
              <div>
                <label htmlFor="pay">Payment</label>
                <select
                  id="pay"
                  value={pay}
                  onChange={(e) => setPay(e.target.value as PayMode)}
                >
                  <option value="paid">Paid in full</option>
                  <option value="credit">On credit (customer owes)</option>
                  <option value="part">Part payment</option>
                </select>

                {pay === 'part' ? (
                  <div>
                    <label htmlFor="paidNow">Amount paid now (₦)</label>
                    <input
                      id="paidNow"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="any"
                      value={paidNow}
                      onChange={(e) => setPaidNow(e.target.value)}
                    />
                  </div>
                ) : null}

                {pay !== 'paid' ? (
                  <div>
                    <label htmlFor="cust">Customer name</label>
                    <input
                      id="cust"
                      list="custs"
                      autoComplete="off"
                      value={cust}
                      onChange={(e) => setCust(e.target.value)}
                    />
                    <datalist id="custs">
                      {custs.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>
                ) : null}
              </div>
            ) : (
              <div>
                <label htmlFor="cat">Category</label>
                <select
                  id="cat"
                  value={cat}
                  onChange={(e) => setCat(e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <button type="submit">Save</button>
          </form>
        </div>
      </section>
    </main>
  )
}
