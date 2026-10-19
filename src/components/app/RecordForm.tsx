import { useState, type FormEvent } from 'react'
import {
  CATEGORIES,
  today,
  uid,
  useLedger,
  type Rec,
  type RecType,
} from '../../lib/store'

type PayMode = 'paid' | 'credit' | 'part'

interface Props {
  initial?: Rec
  title?: string
  submitLabel?: string
  onSubmit: (rec: Rec) => void
  onCancel?: () => void
}

function payModeFor(rec?: Rec): PayMode {
  if (!rec || rec.type !== 'sale') return 'paid'
  if (rec.paid <= 0) return 'credit'
  if (rec.paid >= rec.amount) return 'paid'
  return 'part'
}

export default function RecordForm({
  initial,
  title = 'New record',
  submitLabel = 'Save',
  onSubmit,
  onCancel,
}: Props) {
  const { ledger } = useLedger()

  const [mode, setMode] = useState<RecType>(initial?.type ?? 'sale')
  const [item, setItem] = useState(initial?.item ?? '')
  const [amount, setAmount] = useState(
    initial ? String(initial.amount) : '',
  )
  const [pay, setPay] = useState<PayMode>(() => payModeFor(initial))
  const [paidNow, setPaidNow] = useState(
    initial && initial.type === 'sale' && initial.paid > 0 && initial.paid < initial.amount
      ? String(initial.paid)
      : '',
  )
  const [cust, setCust] = useState(initial?.cust ?? '')
  const [cat, setCat] = useState<string>(
    initial?.cat && (CATEGORIES as readonly string[]).includes(initial.cat)
      ? initial.cat
      : CATEGORIES[0],
  )
  const [date, setDate] = useState(initial?.date ?? today())

  const itemSuggestions = [...new Set(ledger.recs.map((r) => r.item))]
  const custSuggestions = [
    ...new Set(ledger.recs.map((r) => r.cust).filter((c): c is string => !!c)),
  ]

  const showCust = mode === 'sale' && (pay !== 'paid' || !!initial?.cust)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const value = parseFloat(amount)
    if (!(value > 0)) return

    const rec: Rec = {
      id: initial?.id ?? uid(),
      type: mode,
      date,
      item: item.trim(),
      amount: value,
      paid: value,
    }

    if (mode === 'sale') {
      const name = cust.trim()
      if (pay !== 'paid' && !name) {
        alert('Enter the customer name so you can track the debt.')
        return
      }
      rec.paid =
        pay === 'paid' ? value : pay === 'credit' ? 0 : Math.min(value, parseFloat(paidNow) || 0)
      if (name) rec.cust = name
      if (initial?.type === 'sale' && initial.payments?.length) {
        rec.payments = initial.payments
      }
    } else {
      rec.cat = cat
    }

    onSubmit(rec)
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <span className="card-title">{title}</span>

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
              <label htmlFor="paidNow">
                {initial ? 'Amount paid so far' : 'Amount paid now'} ({'\u20a6'})
              </label>
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

          {showCust ? (
            <div className="field">
              <label htmlFor="cust">
                Customer name{pay === 'paid' ? ' (optional)' : ''}
              </label>
              <input
                id="cust"
                className="input"
                list="custs"
                autoComplete="off"
                required={pay !== 'paid'}
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
          {submitLabel}
        </button>
        {onCancel ? (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  )
}
