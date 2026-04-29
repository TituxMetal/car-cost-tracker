import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button, FormWrapper, Input } from '~/components/ui'

import { useAuth } from '../hooks/useAuth'
import type { LoginSchema, SignupSchema } from '../schemas/auth.schema'
import { loginSchema, signupSchema } from '../schemas/auth.schema'
import { routes } from '../utils/routes'

import { AuthHeader } from './AuthHeader'
import { AuthShell } from './AuthShell'
import { SystemStatusPanel } from './SystemStatusPanel'

export interface AuthContainerProps {
  mode?: 'login' | 'signup'
  redirectPath?: string
}

const submitButtonClasses =
  'h-auto min-h-0 w-full justify-center py-4 text-[13px] font-bold tracking-[0.2em]'
const switchLinkClasses =
  'text-base-content/60 block text-center font-mono text-[11px] tracking-wider'
const switchLinkAccentClasses = 'text-primary hover:underline'

const noticeBoxClasses =
  'border border-info bg-base-200 px-4 py-4 font-mono text-xs leading-relaxed tracking-wide grid gap-2'
const noticeLabelClasses = 'text-info font-mono text-[10px] tracking-[0.2em] uppercase'
const noticeLinkClasses = 'text-primary underline underline-offset-2 hover:no-underline'

const ADMIN_EMAIL = 'pre-launch@lgdweb.fr'
const SIGNUP_NOTICE_MAILTO = `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent('Cost Log - Activation de compte')}`

const HEADING_ID = 'auth-heading'

export const AuthContainer = ({ mode = 'login', redirectPath }: AuthContainerProps) => {
  const { login, register, isLoading } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)

  const loginForm = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
    criteriaMode: 'all'
  })

  const signupForm = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: '', email: '', password: '' },
    mode: 'onTouched',
    criteriaMode: 'all'
  })

  const handleLoginSubmit = loginForm.handleSubmit(async data => {
    setServerError(null)
    try {
      await login(data, redirectPath)
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Échec de la connexion')
    }
  })

  const handleSignupSubmit = signupForm.handleSubmit(async data => {
    setServerError(null)
    try {
      await register(data, redirectPath)
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Échec de l'inscription")
    }
  })

  if (mode === 'login') {
    const isFormError = loginForm.formState.isSubmitted && !loginForm.formState.isValid

    return (
      <AuthShell headingId={HEADING_ID}>
        <AuthHeader kicker='// ACCÈS PILOTE' heading='Connexion' headingId={HEADING_ID} />

        <FormWrapper onSubmit={handleLoginSubmit} error={serverError}>
          <Input
            label='E-MAIL'
            type='email'
            autoComplete='email'
            placeholder='vous@exemple.fr'
            error={loginForm.formState.errors.email?.message}
            {...loginForm.register('email')}
          />

          <Input
            label='MOT DE PASSE'
            type='password'
            autoComplete='current-password'
            error={loginForm.formState.errors.password?.message}
            {...loginForm.register('password')}
          />

          <Button type='submit' disabled={isFormError || isLoading} className={submitButtonClasses}>
            {isLoading ? 'Connexion…' : 'Mettre le contact →'}
          </Button>

          <p className={switchLinkClasses}>
            <a href='/auth/forgot-password' className={switchLinkAccentClasses}>
              Mot de passe oublié ?
            </a>
          </p>

          <p className={switchLinkClasses}>
            Pas de compte ?{' '}
            <a href={routes.auth.getOppositeModeUrl('login')} className={switchLinkAccentClasses}>
              Créer votre dashboard
            </a>
          </p>
        </FormWrapper>

        <SystemStatusPanel />
      </AuthShell>
    )
  }

  const isFormError = signupForm.formState.isSubmitted && !signupForm.formState.isValid

  return (
    <AuthShell headingId={HEADING_ID}>
      <AuthHeader kicker='// NOUVEAU PILOTE' heading='Inscription' headingId={HEADING_ID} />

      <div className={noticeBoxClasses} role='note'>
        <p className={noticeLabelClasses}>ALPHA PRIVÉE</p>
        <p className='text-base-content'>
          Cost Log est en accès restreint — chaque inscription est validée à la main par
          l'administrateur après création de compte.
        </p>
        <p className='text-base-content'>
          Une fois le formulaire envoyé, contacte{' '}
          <a href={SIGNUP_NOTICE_MAILTO} className={noticeLinkClasses}>
            {ADMIN_EMAIL}
          </a>{' '}
          en précisant ton email d'inscription, je t'active dès que possible.
        </p>
      </div>

      <FormWrapper onSubmit={handleSignupSubmit} error={serverError}>
        <Input
          label="NOM D'UTILISATEUR"
          type='text'
          autoComplete='username'
          placeholder='votre_pseudo'
          error={signupForm.formState.errors.username?.message}
          {...signupForm.register('username')}
        />

        <Input
          label='E-MAIL'
          type='email'
          autoComplete='email'
          placeholder='vous@exemple.fr'
          error={signupForm.formState.errors.email?.message}
          {...signupForm.register('email')}
        />

        <Input
          label='MOT DE PASSE'
          type='password'
          autoComplete='new-password'
          error={signupForm.formState.errors.password?.message}
          {...signupForm.register('password')}
        />

        <Button type='submit' disabled={isFormError || isLoading} className={submitButtonClasses}>
          {isLoading ? 'Création…' : 'Créer le dashboard →'}
        </Button>

        <p className={switchLinkClasses}>
          Déjà un compte ?{' '}
          <a href={routes.auth.getOppositeModeUrl('signup')} className={switchLinkAccentClasses}>
            Connexion
          </a>
        </p>
      </FormWrapper>

      <SystemStatusPanel />
    </AuthShell>
  )
}
