import { naira, owed, type Rec } from '../lib/ledger'
import { useLedger } from '../lib/ledger-store'

type Props = {
  rec: Rec
  withDelete?: boolean
}

export default function RecordRow({ rec, withDelete = false }: Props) {
  const { deleteRecord } = useLedger()
  const o = owed(rec)

  const tag =
    rec.type === 'sale' ? (
      o > 0 ? (
        <span className="pill credit">owes {naira(o)}</span>
      ) : (
        <span className="pill">paid</span>
      )
    ) : (
      <span className="pill">{rec.cat || 'Expense'}</span>
    )

  return (
    <div className="row">
      <div className="l">
        <b>{rec.item}</b>
        <small>
          {rec.date}
          {rec.cust ? ' · ' + rec.cust : ''} {tag}
        </small>
      </div>
      <div style={{ textAlign: 'right' }}>
        <b className={rec.type === 'sale' ? 'pos' : 'neg'}>
          {rec.type === 'sale' ? '+' : '−'}
          {naira(rec.amount)}
        </b>
        {withDelete ? (
          <>
            <br />
            <button
              type="button"
              className="del"
              onClick={() => {
                if (confirm('Delete this record?')) deleteRecord(rec.id)
              }}
            >
              Delete
            </button>
          </>
        ) : null}
      </div>
    </div>
  )
}
