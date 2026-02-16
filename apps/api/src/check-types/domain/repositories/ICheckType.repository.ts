import type { CheckTypeEntity } from '../entities'
import type { CheckTypeIdValueObject } from '../value-objects'

export interface ICheckTypeRepository {
  create(checkType: CheckTypeEntity): Promise<CheckTypeEntity>
  findById(id: CheckTypeIdValueObject): Promise<CheckTypeEntity | null>
  findByVehicleId(vehicleId: string): Promise<CheckTypeEntity[]>
  update(checkType: CheckTypeEntity): Promise<CheckTypeEntity>
  delete(id: CheckTypeIdValueObject): Promise<void>
  existsByNameAndVehicle(name: string, vehicleId: string): Promise<boolean>
}
