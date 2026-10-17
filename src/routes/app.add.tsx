import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import {
  CATEGORIES,
  today,
  uid,
  useLedger,
  type Rec,
  type RecType,
} from '../lib/store'

export const Route = createFileRoute('/app/add')({
  component: Add,
})

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
  const [date, setDate] = useState(() => today())

  const itemSuggestions = [...new Set(ledger.recs.map((r) => r.item))]
  const custSuggestions = [
    ...new Set(ledger.recs.map((r) => r.cust).filter((c): c is string => !!c)),
  ]

  function reset() {
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
        const name = cust.trim()
        if (!name) {
          alert('Enter the customer name so you can track the debt.')
          return
        }
        rec.cust = name
        rec.paid =
          pay === 'credit' ? 0 : Math.min(value, parseFloat(paidNow) || 0)
      }
    } else {
      rec.cat = cat
    }

    addRecord(rec)
    reset()
    navigate({ to: '/app' })
  }

  return (
    <form className="card" onSubmit={onSubmit}>
      <span className="card-title">New record</span>

      <div className="seg" role="group" aria-label="Record type">
        <button
          type="button"
          aria-pressed={mode === 'sale'}
          onClick={() => setMode('sale')}
        >
          Sale
        </button>
        <button
          type="button"
          className="exp"
          aria-pressed={mode === 'exp'}
          onClick={() => setMode('exp')}
        >
          Expense
        </button>
      </div>

      <div className="field">
        <label htmlFor="item">
          {mode === 'sale'
            ? 'Item sold (e.g. tomatoes, 2 bags rice)'
            : 'What did you spend on?'}
        </label>
        <input
          id="item"
          className="input"
          list="items"
          autoComplete="off"
          required
          value={item}
          onChange={(e) => setItem(e.target.value)}
        />
        <datalist id="items">
          {itemSuggestions.map((i) => (
            <option key={i} value={i} />
          ))}
        </datalist>
      </div>

      <div className="field">
        <label htmlFor="amount">Amount ({'\u20a6'})</label>
        <input
          id="amount"
          className="input"
          type="number"
          inputMode="decimal"
          min="0"
          step="any"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      {mode === 'sale' ? (
        <>
          <div className="field">
            <label htmlFor="pay">Payment</label>
            <select
              id="pay"
              className="select"
              value={pay}
              onChange={(e) => setPay(e.target.value as PayMode)}
            >
              <option value="paid">Paid in full</option>
              <option value="credit">On credit (customer owes)</option>
              <option value="part">Part payment</option>
            </select>
          </div>

          {pay === 'part' ? (
            <div className="field">
              <label htmlFor="paidNow">Amount paid now ({'\u20a6'})</label>
              <input
                id="paidNow"
                className="input"
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
            <div className="field">
              <label htmlFor="cust">Customer name</label>
              <input
                id="cust"
                className="input"
                list="custs"
                autoComplete="off"
                value={cust}
                onChange={(e) => setCust(e.target.value)}
              />
              <datalist id="custs">
                {custSuggestions.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
          ) : null}
        </>
      ) : (
        <div className="field">
          <label htmlFor="cat">Category</label>
          <select
            id="cat"
            className="select"
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

      <div className="field">
        <label htmlFor="date">Date</label>
        <input
          id="date"
          className="input"
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </div>
    </form>
  )
}
