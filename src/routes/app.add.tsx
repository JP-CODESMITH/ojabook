import { createFileRoute, useNavigate } from '@tanstack/react-router'
import RecordForm from '../components/app/RecordForm'
import { useLedger, type Rec } from '../lib/store'

export const Route = createFileRoute('/app/add')({
  component: Add,
})

function Add() {
  const { addRecord } = useLedger()
  const navigate = useNavigate()

  function onSave(rec: Rec) {
    addRecord(rec)
    navigate({ to: '/app' })
  }

  return <RecordForm onSubmit={onSave} />
}
