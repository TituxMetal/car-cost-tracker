export class GetCheckLogDto {
  id!: string
  checkTypeId!: string
  checkTypeName!: string
  completedAt!: string
  notes!: string | null
  nextDueAt!: string
  createdAt!: Date
}
