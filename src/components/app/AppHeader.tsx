import { useEffect, useState } from 'react'
import { Logo } from '../Logo'
import { useLedger } from '../../lib/store'

function useOnline(): boolean {
  const [online, setOnline] = useState(true)
  useEffect(() => {
    const update = () => setOnline(navigator.onLine)
    update()
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [])
  return online
}

export default function AppHeader() {
  const { ledger, setBiz } = useLedger()
  const online = useOnline()

  return (
    <header className="app-header">
      <div className="bar">
        <div className="brandline">
          <Logo size={26} />
          <div>
            <h1>Ojabook</h1>
            <span className="app-status">
              {online ? 'Saved on this phone' : 'Offline · all good'}
            </span>
          </div>
        </div>
        <input
          className="biz-input"
          placeholder="Business name"
          aria-label="Business name"
          autoComplete="off"
          value={ledger.biz}
          onChange={(e) => setBiz(e.target.value)}
        />
      </div>
    </header>
  )
}
