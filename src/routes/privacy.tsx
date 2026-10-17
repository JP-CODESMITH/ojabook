import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/privacy')({
  head: () => ({
    meta: [
      { title: 'Privacy — Ojabook' },
      {
        name: 'description',
        content:
          'How Ojabook handles your information: your records stay on your phone, with no account and no cloud.',
      },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: Privacy,
})

function Privacy() {
  return (
    <main className="doc">
      <p className="eyebrow">Privacy</p>
      <h1>Your records stay on your phone</h1>

      <div className="draft-banner">
        <strong>Draft — needs review before launch.</strong>
        This page is a plain-language first draft. It must be checked by someone
        who knows the final setup (for example, whether website analytics is
        switched on and which service is used) before Ojabook is released.
      </div>

      <h2>What we collect</h2>
      <p>
        Ojabook has no account and no sign-in. The sales, expenses and debts you
        enter are saved in your own browser storage on your device. We do not
        receive them, and we cannot read them. There is no server holding your
        records.
      </p>

      <h2>Where your records live</h2>
      <p>
        Your records are stored only on the phone or computer you are using. If
        you clear your browser data, uninstall the app, or lose the device, the
        records are lost unless you downloaded a backup first.
      </p>
      <ul>
        <li>No cloud copy is kept.</li>
        <li>No multi-device syncing.</li>
        <li>Backups are files you download and keep yourself.</li>
      </ul>

      <h2>Website analytics</h2>
      <p>
        The landing page may use a privacy-friendly analytics service to count
        visits (for example, Cloudflare Web Analytics). This page must be
        updated to name the exact service, and to state that this applies to the
        website only — not to the records inside the app, which never leave your
        device. Until that is confirmed, treat this section as incomplete.
      </p>

      <h2>Your choices</h2>
      <p>
        You control your data completely. You can delete any record inside the
        app, download a CSV or a JSON backup from the History tab, or clear your
        browser data to remove everything.
      </p>

      <h2>Contact</h2>
      <p>
        Contact details must be added before launch (email address or other
        channel for privacy questions).
      </p>

      <Link className="back" to="/">
        ← Back to Ojabook
      </Link>
    </main>
  )
}
