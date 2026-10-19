import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import RecordRow from '../components/app/RecordRow'
import {
  downloadBackup,
  downloadCsv,
  readBackupFile,
  sortRecs,
  useLedger,
} from '../lib/store'

export const Route = createFileRoute('/app/history')({
  component: History,
})

function History() {
  const { ledger, deleteRecord, replaceAll } = useLedger()
  const fileRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const sorted = sortRecs(ledger.recs)

  const needle = query.trim().toLowerCase()
  const filtered = needle
    ? sorted.filter(
        (r) =>
          r.item.toLowerCase().includes(needle) ||
          (r.cust ?? '').toLowerCase().includes(needle),
      )
    : sorted

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const backup = await readBackupFile(file)
      if (!confirm('Replace the records on this phone with this backup?')) {
        return
      }
      replaceAll(backup)
    } catch {
      alert('That file is not a valid Ojabook backup.')
    }
  }

  function onEdit(id: string) {
    navigate({ to: '/app/edit/$id', params: { id } })
  }

  function onDelete(id: string) {
    if (confirm('Delete this record?')) deleteRecord(id)
  }

  return (
    <>
      <div className="card">
        <span className="card-title">All records</span>
        <div className="field history-filter">
          <label htmlFor="history-filter">Search by name or item</label>
          <input
            id="history-filter"
            className="input"
            type="search"
            placeholder="e.g. Ada or rice"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {filtered.length ? (
          <div>
            {filtered.map((r) => (
              <RecordRow
                key={r.id}
                rec={r}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        ) : (
          <div className="empty">
            {needle ? 'No records match that search.' : 'Nothing here yet.'}
          </div>
        )}
      </div>

      <div className="card">
        <span className="card-title">Backup</span>
        <button
          type="button"
          className="sec-btn"
          onClick={() => downloadCsv(ledger.recs)}
        >
          Download CSV (spreadsheet)
        </button>
        <button
          type="button"
          className="sec-btn"
          onClick={() => downloadBackup(ledger)}
        >
          Download backup (JSON)
        </button>
        <button
          type="button"
          className="sec-btn"
          onClick={() => fileRef.current?.click()}
        >
          Restore from backup
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          hidden
          onChange={onFile}
        />
        <p className="hint">
          Your records live only on this phone. Download a backup now and then,
          and keep it somewhere safe.
        </p>
      </div>
    </>
  )
}
