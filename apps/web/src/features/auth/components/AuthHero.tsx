const heroClasses =
  'border-base-300 hidden flex-col justify-between gap-12 border-r bg-base-100 p-10 lg:flex lg:p-20'
const brandRowClasses = 'flex items-center gap-2.5'
const brandSquareClasses = 'bg-primary inline-flex h-7 w-7 items-center justify-center rounded-sm'
const brandRingClasses = 'border-base-100 inline-block h-3.5 w-3.5 rounded-full border-2'
const brandWordClasses = 'font-display text-sm font-bold tracking-[0.18em]'
const kickerClasses = 'text-primary font-mono text-[10px] tracking-[0.2em] uppercase'
const titleClasses =
  'font-display mt-3 text-5xl font-semibold leading-[1.05] tracking-tight lg:text-6xl'
const tagClasses = 'text-base-content/60 mt-5 max-w-md font-mono text-sm leading-relaxed'
const versionClasses = 'text-base-content/50 font-mono text-[10px] tracking-[0.18em] uppercase'

export const AuthHero = () => {
  const buildLabel = `COST.LOG · ${new Date().getFullYear()}`

  return (
    <aside className={heroClasses} aria-label='Présentation COST.LOG'>
      <a href='/' className={brandRowClasses}>
        <span className={brandSquareClasses} aria-hidden='true'>
          <span className={brandRingClasses}></span>
        </span>
        <span className={brandWordClasses}>
          COST<span className='text-primary'>.LOG</span>
        </span>
      </a>

      <div>
        <p className={kickerClasses}>// IGNITION</p>
        <p className={titleClasses}>
          Démarrer votre
          <br />
          tableau de bord.
        </p>
        <p className={tagClasses}>
          Chaque contrôle, chaque kilomètre, chaque vidange — archivé. Pour que votre voiture vous
          parle avant de tomber en panne.
        </p>
      </div>

      <p className={versionClasses}>{buildLabel}</p>
    </aside>
  )
}
