import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import AppLoading from '../components/app/AppLoading'
import RecordForm from '../components/app/RecordForm'
import { useLedger } from '../lib/store'

export const Route = createFileRoute('/app/edit/$id')({
  component: EditRecord,
})

function EditRecord() {
  const { id } = Route.useParams()
  const { ledger, ready, updateRecord } = useLedger()
  const navigate = useNavigate()
  const rec = ledger.recs.find((r) => r.id === id)

  if (!ready) return <AppLoading />

  if (!rec) {
    return (
      <div className="card">
        <span className="card-title">Record not found</span>
        <p className="hint">It may have been deleted.</p>
        <Link to="/app/history" className="btn btn-secondary btn-block">
          Back to history
        </Link>
      </div>
    )
  }

  return (
    <RecordForm
      key={rec.id}
      initial={rec}
      title="Edit record"
      submitLabel="Save changes"
      onSubmit={(next) => {
        updateRecord(next)
        navigate({ to: '/app/history' })
      }}
      onCancel={() => navigate({ to: '/app/history' })}
    />
  )
}
