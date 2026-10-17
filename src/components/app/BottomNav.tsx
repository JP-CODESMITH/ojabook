import { Link } from '@tanstack/react-router'

type IconName = 'home' | 'add' | 'debts' | 'history'

const TABS: ReadonlyArray<{
  to: string
  label: string
  icon: IconName
  exact: boolean
}> = [
  { to: '/app', label: 'Home', icon: 'home', exact: true },
  { to: '/app/add', label: 'Add', icon: 'add', exact: false },
  { to: '/app/debts', label: 'Debts', icon: 'debts', exact: false },
  { to: '/app/history', label: 'History', icon: 'history', exact: false },
]

function Icon({ name }: { name: IconName }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.9,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    focusable: false,
  }
  switch (name) {
    case 'home':
      return (
        <svg {...common}>
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5.5 9.5V21h13V9.5" />
        </svg>
      )
    case 'add':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      )
    case 'debts':
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3.2" />
          <path d="M3.5 19.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
          <path d="M16 7h5M16 11h5" />
        </svg>
      )
    case 'history':
      return (
        <svg {...common}>
          <path d="M4 5h16M4 12h16M4 19h16" />
          <path d="M8.5 5v14" />
        </svg>
      )
  }
}

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main">
      {TABS.map((tab) => (
        <Link key={tab.to} to={tab.to} activeOptions={{ exact: tab.exact }}>
          <Icon name={tab.icon} />
          {tab.label}
        </Link>
      ))}
    </nav>
  )
}
