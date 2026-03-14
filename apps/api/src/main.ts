import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'

import { AppModule } from '~/app.module'

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, { bodyParser: false })

  const isProduction = process.env.NODE_ENV === 'production'
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4321'
  const allowedOrigins = isProduction ? [frontendUrl] : ['http://localhost:4321']

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })

  app.use(cookieParser())
  app.setGlobalPrefix('api', {
    exclude: ['/api/auth/*path']
  })

  await app.listen(process.env.PORT ?? 3000)
}

bootstrap()
