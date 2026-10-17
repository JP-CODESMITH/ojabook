import { Logo } from '../Logo'

export default function AppLoading() {
  return (
    <div className="app-loading" role="status" aria-live="polite">
      <Logo size={44} />
      <p>Loading Ojabook…</p>
    </div>
  )
}
