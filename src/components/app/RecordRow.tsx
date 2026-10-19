import { naira, owed, type Rec } from '../../lib/store'

interface Props {
  rec: Rec
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export default function RecordRow({ rec, onEdit, onDelete }: Props) {
  const remaining = owed(rec)

  return (
    <div className="row">
      <div className="l">
        <b>{rec.item}</b>
        <small className="nums">
          {rec.date}
          {rec.cust ? ` · ${rec.cust}` : ''}{' '}
          {rec.type === 'sale' ? (
            remaining > 0 ? (
              <span className="pill credit">owes {naira(remaining)}</span>
            ) : (
              <span className="pill">paid</span>
            )
          ) : (
            <span className="pill cat">{rec.cat || 'Expense'}</span>
          )}
        </small>
      </div>
      <div className="r">
        <span className={`amt ${rec.type === 'sale' ? 'pos' : 'neg'}`}>
          {rec.type === 'sale' ? '+' : '\u2212'}
          {naira(rec.amount)}
        </span>
        {onEdit || onDelete ? (
          <div className="row-actions">
            {onEdit ? (
              <button
                type="button"
                className="btn-inline"
                onClick={() => onEdit(rec.id)}
              >
                Edit
              </button>
            ) : null}
            {onDelete ? (
              <button
                type="button"
                className="btn-danger"
                onClick={() => onDelete(rec.id)}
              >
                Delete
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
