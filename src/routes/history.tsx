import { createFileRoute } from '@tanstack/react-router'
import { useRef } from 'react'
import RecordRow from '../components/RecordRow'
import { owed, sortRecs, today, type Ledger } from '../lib/ledger'
import { useLedger } from '../lib/ledger-store'

export const Route = createFileRoute('/history')({ component: History })

function download(name: string, text: string, type: string) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([text], { type }))
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}

function History() {
  const { ledger, replaceAll } = useLedger()
  const fileRef = useRef<HTMLInputElement>(null)

  const sorted = sortRecs(ledger.recs)

  function exportCsv() {
    const q = (s: unknown) => '"' + String(s ?? '').replace(/"/g, '""') + '"'
    const lines = ['Date,Type,Item,Amount,Paid,Owed,Customer,Category']
    ;[...ledger.recs]
      .sort((a, b) => a.date.localeCompare(b.date))
      .forEach((r) =>
        lines.push(
          [
            r.date,
            r.type === 'sale' ? 'Sale' : 'Expense',
            q(r.item),
            r.amount,
            r.type === 'sale' ? r.paid : '',
            owed(r),
            q(r.cust),
            q(r.cat),
          ].join(','),
        ),
      )
    download(`ledger-${today()}.csv`, lines.join('\n'), 'text/csv')
  }

  function backup() {
    download(
      `ledger-backup-${today()}.json`,
      JSON.stringify(ledger),
      'application/json',
    )
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result)) as Ledger
        if (!Array.isArray(data.recs)) throw new Error('invalid backup')
        if (!confirm('Replace current records with this backup?')) return
        replaceAll({
          biz: typeof data.biz === 'string' ? data.biz : '',
          recs: data.recs,
        })
      } catch {
        alert('That file is not a valid backup.')
      } finally {
        e.target.value = ''
      }
    }
    reader.readAsText(file)
  }

  return (
    <main>
      <section>
        <div className="card">
          <b>All records</b>
          {sorted.length ? (
            <div>
              {sorted.map((r) => (
                <RecordRow key={r.id} rec={r} withDelete />
              ))}
            </div>
          ) : (
            <div className="empty">Nothing here yet.</div>
          )}
        </div>

        <div className="card">
          <b>Backup</b>
          <button type="button" className="sec" onClick={exportCsv}>
            Download CSV
          </button>
          <button type="button" className="sec" onClick={backup}>
            Download backup (JSON)
          </button>
          <button
            type="button"
            className="sec"
            onClick={() => fileRef.current?.click()}
          >
            Restore from backup
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={onFile}
          />
          <p style={{ fontSize: 12, color: 'var(--mut)' }}>
            Your records live only on this phone. Download a backup now and
            then.
          </p>
        </div>
      </section>
    </main>
  )
}
