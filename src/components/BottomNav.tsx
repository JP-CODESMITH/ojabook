import { Link } from '@tanstack/react-router'

const TABS = [
  { to: '/', label: 'Home' },
  { to: '/add', label: 'Add' },
  { to: '/debts', label: 'Debts' },
  { to: '/history', label: 'History' },
] as const

export default function BottomNav() {
  return (
    <nav>
      {TABS.map((tab) => (
        <Link
          key={tab.to}
          to={tab.to}
          className="tab-link"
          activeProps={{ className: 'tab-link on' }}
          activeOptions={{ exact: tab.to === '/' }}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  )
}
