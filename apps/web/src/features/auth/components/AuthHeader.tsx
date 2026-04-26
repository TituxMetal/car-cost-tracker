export interface AuthHeaderProps {
  kicker: string
  heading: string
  headingId: string
}

const kickerClasses = 'text-base-content/60 font-mono text-[10px] tracking-[0.18em] uppercase'
const headingClasses = 'font-display mt-2 text-3xl font-semibold tracking-tight sm:text-4xl'

export const AuthHeader = ({ kicker, heading, headingId }: AuthHeaderProps) => (
  <header>
    <p className={kickerClasses}>{kicker}</p>
    <h1 id={headingId} className={headingClasses}>
      {heading}
    </h1>
  </header>
)
