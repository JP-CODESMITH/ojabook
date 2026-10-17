import { Link, createFileRoute } from '@tanstack/react-router'
import Analytics from '../components/Analytics'
import { Wordmark } from '../components/Logo'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Ojabook — replace the sales notebook' },
      {
        name: 'description',
        content:
          'Record sales and expenses in seconds, and always know who owes you. Ojabook works offline and keeps your records on your own phone.',
      },
      { property: 'og:title', content: 'Ojabook — replace the sales notebook' },
      {
        property: 'og:description',
        content:
          'Simple, offline bookkeeping for small traders and agro-businesses in Nigeria.',
      },
      { property: 'og:type', content: 'website' },
    ],
  }),
  component: Landing,
})

function HeroArt() {
  return (
    <svg
      viewBox="0 0 380 300"
      role="img"
      aria-label="A phone showing a daily total, next to a crossed-out notebook"
    >
      <rect x="24" y="26" width="200" height="250" rx="14" fill="#fffdf6" stroke="#cec2a6" strokeWidth="2" />
      <g stroke="#c8bfa6" strokeWidth="3" strokeLinecap="round">
        <line x1="48" y1="66" x2="200" y2="66" />
        <line x1="48" y1="102" x2="176" y2="102" />
        <line x1="48" y1="138" x2="196" y2="138" />
        <line x1="48" y1="174" x2="150" y2="174" />
        <line x1="48" y1="210" x2="188" y2="210" />
        <line x1="48" y1="246" x2="140" y2="246" />
      </g>
      <path
        d="M40 250 L210 40"
        stroke="#9e3520"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <rect x="228" y="14" width="136" height="264" rx="22" fill="#18201a" />
      <rect x="238" y="26" width="116" height="240" rx="14" fill="#f8f3e7" />
      <rect x="238" y="26" width="116" height="56" rx="14" fill="#1b6b3a" />
      <text x="252" y="52" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="11" fontWeight="700" fill="#e2efe3">
        TODAY
      </text>
      <text x="252" y="72" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="20" fontWeight="800" fill="#ffffff">
        ₦42,500
      </text>
      <g fontFamily="ui-sans-serif, system-ui, sans-serif">
        <rect x="250" y="96" width="92" height="26" rx="6" fill="#fffdf6" stroke="#e3dac6" />
        <text x="258" y="113" fontSize="10" fill="#59645b">Bag of rice</text>
        <text x="336" y="113" fontSize="10" fontWeight="700" fill="#1b6b3a" textAnchor="end">+9,000</text>
        <rect x="250" y="130" width="92" height="26" rx="6" fill="#fffdf6" stroke="#e3dac6" />
        <text x="258" y="147" fontSize="10" fill="#59645b">Transport</text>
        <text x="336" y="147" fontSize="10" fontWeight="700" fill="#9e3520" textAnchor="end">−1,200</text>
        <rect x="250" y="164" width="92" height="26" rx="6" fill="#fffdf6" stroke="#e3dac6" />
        <text x="258" y="181" fontSize="10" fill="#59645b">Mama Ngozi</text>
        <text x="336" y="181" fontSize="10" fontWeight="700" fill="#a9630a" textAnchor="end">owes</text>
      </g>
      <rect x="250" y="200" width="92" height="52" rx="10" fill="#e2efe3" />
      <text x="258" y="219" fontSize="9" fill="#114d29">Customers owe</text>
      <text x="258" y="240" fontSize="17" fontWeight="800" fill="#114d29" fontFamily="ui-sans-serif, system-ui, sans-serif">
        ₦12,400
      </text>
    </svg>
  )
}

const FEATURES = [
  {
    title: 'Record every sale',
    body: 'Write down what you sold and how it was paid — full payment, on credit, or part now and part later. Ojabook works out the balance.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="4" y="3" width="16" height="18" rx="3" />
        <path d="M8 8h8M8 12h6M8 16h4" />
      </svg>
    ),
  },
  {
    title: 'Track what you spend',
    body: 'Put expenses in with a simple category — stock, transport, labour, feed, rent. You always see what is really left as profit.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 6h16v12H4z" />
        <path d="M12 9v6M9.5 10.5h5M9.5 13.5h5" />
      </svg>
    ),
  },
  {
    title: 'Know who owes you',
    body: 'Debts are grouped by customer, named and clear. When someone pays, record it once and the oldest debt is settled first.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3.5 19.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
        <path d="M16 7h5M16 11h5" />
      </svg>
    ),
  },
]

const STEPS = [
  {
    title: 'Write it down',
    body: 'Tap Add, type the item and the amount, and choose the date. It takes a few seconds, even with one hand.',
  },
  {
    title: 'See your money',
    body: 'The home screen adds up your sales, expenses and profit for today, this week or this month.',
  },
  {
    title: 'Collect what you are owed',
    body: 'Open Debts to see who owes you. When they pay, record it and the balance updates.',
  },
]

const FAQ = [
  {
    q: 'Will I lose my records if I lose my phone?',
    a: 'Yes, unless you have a backup. There is no cloud copy yet — records live only on this phone. Open History and tap “Download backup” now and then, then keep that file somewhere safe like your email or a memory card.',
  },
  {
    q: 'Do I need an account or internet?',
    a: 'No account, no sign-in and no internet. Ojabook works fully offline once it has opened the first time.',
  },
  {
    q: 'Can I move my records to a new phone?',
    a: 'Yes. On the old phone use History → Download backup (JSON). On the new phone open History → Restore from backup and choose that file.',
  },
  {
    q: 'Is Ojabook free?',
    a: 'Yes, it is free to use. There is no payment and nothing to subscribe to.',
  },
  {
    q: 'Can I see the numbers as a spreadsheet?',
    a: 'Yes. History → Download CSV gives you a file you can open in Excel or Google Sheets.',
  },
]

function Landing() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <div className="wrap">
          <Wordmark />
          <Link className="btn btn-primary" to="/app">
            Open the app
          </Link>
        </div>
      </header>

      <main id="main">
        <section className="hero">
          <div className="wrap">
            <div>
              <p className="eyebrow">Offline bookkeeping</p>
              <h1>Put down the notebook. Pick up Ojabook.</h1>
              <p className="lead">
                Record sales and expenses in seconds, and always know who owes
                you. Ojabook adds everything up for you — and it works even
                without data.
              </p>
              <div className="hero-lede-under">
                <Link className="btn btn-primary" to="/app">
                  Open the app
                </Link>
                <a className="btn btn-secondary" href="#install">
                  How to install
                </a>
              </div>
              <p className="hero-note">
                <span className="dot" aria-hidden="true" />
                Free · No account · Works offline
              </p>
            </div>
            <div className="hero-art">
              <HeroArt />
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">What it does</p>
              <h2>Three things, done properly</h2>
              <p>
                Ojabook is not trying to be an accounting office. It does the
                three jobs a trader actually needs every day.
              </p>
            </div>
            <div className="cards-3">
              {FEATURES.map((f) => (
                <article className="feature" key={f.title}>
                  <span className="icon">{f.icon}</span>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">How it works</p>
              <h2>Three steps, every day</h2>
            </div>
            <ol className="steps">
              {STEPS.map((s) => (
                <li key={s.title}>
                  <span className="num" aria-hidden="true" />
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section">
          <div className="wrap two-col">
            <div className="panel">
              <p className="eyebrow">No network needed</p>
              <h2>Works without data</h2>
              <p>
                Market network comes and goes. Ojabook does not need it. Once
                you have opened the app one time, it keeps working with no data
                and no Wi-Fi — recording sales, expenses and debts exactly as
                normal.
              </p>
              <p>
                Everything is added up on your phone itself, so the app stays
                quick and does not wait on a network that may not be there.
              </p>
            </div>
            <div className="panel panel-tint">
              <p className="eyebrow">Private by default</p>
              <h2>Your records stay on your phone</h2>
              <p>
                There is no account and no cloud. Your sales, expenses and
                debts are saved on your own device — not on a server we can
                read. We never see your customers or your numbers.
              </p>
              <p>
                The trade-off is honest: if you clear your browser data or lose
                the phone, the records are gone. That is why Ojabook lets you
                download a backup whenever you like.
              </p>
            </div>
          </div>
        </section>

        <section className="section" id="install">
          <div className="wrap">
            <div className="panel">
              <p className="eyebrow">Get it on your home screen</p>
              <h2>How to install on Android</h2>
              <p>
                Installing puts Ojabook on your home screen so it opens like a
                normal app, full screen and offline.
              </p>
              <ol className="install-steps">
                <li>Open this page in Chrome on your Android phone.</li>
                <li>
                  If a small bar says “Add Ojabook to Home screen”, tap it.
                </li>
                <li>
                  Otherwise tap the three-dot menu (⋮) at the top right of
                  Chrome.
                </li>
                <li>
                  Tap <strong>Add to Home screen</strong>, then{' '}
                  <strong>Install</strong>.
                </li>
                <li>
                  Confirm — the Ojabook icon now appears with your other apps.
                </li>
              </ol>
              <p className="hint">
                On iPhone, open this page in Safari, tap the Share button, then
                choose “Add to Home Screen”.
              </p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">Questions</p>
              <h2>Straight answers</h2>
            </div>
            <div className="faq">
              {FAQ.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap">
          <Wordmark />
          <p className="footer-meta">
            Made for small traders and agro-businesses in Nigeria. Records live
            on your device — download a backup from the History tab.
          </p>
          <p className="footer-meta">
            <Link to="/privacy">Privacy</Link> · <Link to="/app">Open the app</Link>
          </p>
        </div>
      </footer>

      <Analytics />
    </>
  )
}
