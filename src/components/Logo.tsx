export function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3.5" y="2.5" width="25" height="27" rx="5" fill="#1b6b3a" />
      <rect x="7.5" y="2.5" width="21" height="27" rx="4" fill="#fffdf6" />
      <rect x="6.5" y="2.5" width="4.5" height="27" fill="#114d29" />
      <rect x="13.5" y="8" width="11" height="2.4" rx="1.2" fill="#1b6b3a" />
      <rect x="13.5" y="13.4" width="12" height="1.8" rx="0.9" fill="#c8bfa6" />
      <rect x="13.5" y="17.6" width="9" height="1.8" rx="0.9" fill="#c8bfa6" />
      <rect x="13.5" y="21.8" width="10.5" height="1.8" rx="0.9" fill="#c8bfa6" />
      <text
        x="24"
        y="26.4"
        textAnchor="end"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize="10"
        fontWeight="700"
        fill="#1b6b3a"
      >
        ₦
      </text>
    </svg>
  )
}

export function Wordmark() {
  return (
    <span className="wordmark">
      <Logo />
      Ojabook
    </span>
  )
}
