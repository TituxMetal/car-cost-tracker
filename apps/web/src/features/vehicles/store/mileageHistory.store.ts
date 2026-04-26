import { atom } from 'nanostores'

export const $mileageHistoryTick = atom<number>(0)

export const bumpMileageHistoryTick = (): void => {
  $mileageHistoryTick.set($mileageHistoryTick.get() + 1)
}
