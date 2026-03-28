import type { BetterAuthOptions } from 'better-auth'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin } from 'better-auth/plugins'

import type { PrismaClient } from '@generated'

import type { EmailService } from '~/auth/infrastructure/services'
import type { ConfigService } from '~/config'

export const createBetterAuthConfig = (
  prisma: PrismaClient,
  emailService: EmailService,
  configService: ConfigService
) => {
  const frontendUrl = configService.betterAuth.frontendUrl
  const isProduction = configService.app.isProduction

  const config = {
    secret: configService.betterAuth.secret,
    baseURL: configService.betterAuth.baseURL,
    trustedOrigins: [frontendUrl],
    database: prismaAdapter(prisma, { provider: 'sqlite' }),
    advanced: {
      useSecureCookies: isProduction,
      defaultCookieAttributes: isProduction ? { sameSite: 'lax' as const, secure: true } : undefined
    },
    emailVerification: {
      sendVerificationEmail: async ({ user, url }, _request) => {
        const parsed = new URL(url)
        parsed.searchParams.set('callbackURL', `${frontendUrl}/auth`)
        await emailService.sendVerificationEmail(user.email, parsed.toString())
      }
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      sendResetPassword: async ({ user, url }, _request) => {
        await emailService.sendPasswordResetEmail(user.email, url)
      }
    },
    user: {
      additionalFields: {
        username: { type: 'string', required: true, input: true },
        firstName: { type: 'string', required: false, input: true },
        lastName: { type: 'string', required: false, input: true }
      },
      deleteUser: {
        enabled: true
      }
    },
    session: {
      expiresIn: configService.session.expiresIn,
      updateAge: configService.session.updateAge
    },
    plugins: [admin({ defaultRole: 'user', adminRole: 'admin' })],
    hooks: {}
  } satisfies BetterAuthOptions

  return betterAuth(config)
}

export type AuthInstance = ReturnType<typeof createBetterAuthConfig>
