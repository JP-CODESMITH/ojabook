import { Outlet, createFileRoute } from '@tanstack/react-router'
import AppHeader from '../components/app/AppHeader'
import BottomNav from '../components/app/BottomNav'
import { useLedger } from '../lib/store'

export const Route = createFileRoute('/app')({
  component: AppLayout,
})

function AppLayout() {
  const { storageError } = useLedger()

  return (
    <div className="app-shell">
      <AppHeader />
      <main className="app-main" id="main">
        {storageError ? (
          <p className="storage-alert" role="alert">
            Could not save just now — your phone storage may be full. Download a
            backup from History, then free up some space.
          </p>
        ) : null}
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
