import type { ReactNode } from 'react'

import { AuthHero } from './AuthHero'

export interface AuthShellProps {
  headingId: string
  children: ReactNode
}

const shellClasses = 'bg-base-100 text-base-content grid min-h-screen grid-cols-1 lg:grid-cols-2'
const formColumnClasses =
  'bg-base-200 flex flex-col justify-center gap-8 px-6 py-12 sm:px-10 lg:px-20 lg:py-20'

export const AuthShell = ({ headingId, children }: AuthShellProps) => (
  <main className={shellClasses}>
    <AuthHero />
    <section className={formColumnClasses} aria-labelledby={headingId}>
      {children}
    </section>
  </main>
)
