import { useEffect, useState } from 'react'
import { useLedger } from '../lib/ledger-store'

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

export default function Header() {
  const { ledger, setBiz } = useLedger()
  const online = useOnline()

  return (
    <header>
      <div>
        <h1>Ledger</h1>
        <span id="status">{online ? 'Saved on this phone' : 'Offline · all good'}</span>
      </div>
      <input
        id="biz"
        placeholder="Business name"
        aria-label="Business name"
        autoComplete="off"
        value={ledger.biz}
        onChange={(e) => setBiz(e.target.value)}
      />
    </header>
  )
}
