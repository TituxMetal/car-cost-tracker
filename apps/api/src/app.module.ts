import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from '~/auth/Auth.module'
import { CheckLogsModule } from '~/check-logs/CheckLogs.module'
import { CheckTypesModule } from '~/check-types/CheckTypes.module'
import { ExpensesModule } from '~/expenses/Expenses.module'
import { PrismaModule } from '~/shared/infrastructure/database'
import { SharedModule } from '~/shared/Shared.module'
import { UsersModule } from '~/users/Users.module'
import { VehiclesModule } from '~/vehicles/Vehicles.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    SharedModule,
    PrismaModule,
    UsersModule,
    VehiclesModule,
    CheckTypesModule,
    CheckLogsModule,
    ExpensesModule,
    AuthModule
  ]
})
export class AppModule {}
