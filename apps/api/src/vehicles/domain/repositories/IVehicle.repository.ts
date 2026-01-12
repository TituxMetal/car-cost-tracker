import type { VehicleEntity } from '../entities'
import type { VehicleIdValueObject } from '../value-objects'

/**
 * Vehicle Repository Interface
 *
 * Defines the contract for vehicle persistence operations.
 * Implementation lives in infrastructure layer (Prisma).
 */
export interface IVehicleRepository {
  create(vehicle: VehicleEntity): Promise<VehicleEntity>
  findById(vehicleId: VehicleIdValueObject): Promise<VehicleEntity | null>
  findByUserId(userId: string): Promise<VehicleEntity[]>
  update(vehicle: VehicleEntity): Promise<VehicleEntity>
  delete(vehicleId: VehicleIdValueObject): Promise<void>
  existsForUser(vehicleId: VehicleIdValueObject, userId: string): Promise<boolean>
}
