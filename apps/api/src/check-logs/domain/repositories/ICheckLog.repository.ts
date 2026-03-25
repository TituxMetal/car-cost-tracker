import type { CheckLogEntity } from '../entities'
import type { CheckLogIdValueObject } from '../value-objects'

export interface ICheckLogRepository {
  create(checkLog: CheckLogEntity): Promise<CheckLogEntity>
  findById(id: CheckLogIdValueObject): Promise<CheckLogEntity | null>
  findByCheckTypeId(checkTypeId: string): Promise<CheckLogEntity[]>
  findByVehicleId(vehicleId: string): Promise<CheckLogEntity[]>
  findMostRecentByCheckTypeIds(checkTypeIds: string[]): Promise<Map<string, CheckLogEntity>>
  delete(id: CheckLogIdValueObject): Promise<void>
}
