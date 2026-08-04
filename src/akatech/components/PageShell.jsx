export default function PageShell({ children, className = '' }) {
  return (
    <div className={`akatech-page-shell ${className}`.trim()}>
      <div className="akatech-page-shell__glow akatech-page-shell__glow--one" />
      <div className="akatech-page-shell__glow akatech-page-shell__glow--two" />
      <div className="akatech-page-shell__grid" />
      <div className="akatech-page-shell__content">{children}</div>
    </div>
  )
}
