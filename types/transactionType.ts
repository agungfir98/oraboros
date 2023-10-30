export const category = [
  'fnb',
  'self_reward',
  'transportation',
  'household',
  'skincare',
  'electronic',
  'wearable',
  'health',
  'energy',
  'etc',
] as const

export interface TransactionType {
  id?: string
  price: number
  quantity: number
  itemName: string
  date: { seconds: number; nanoseconds: number } | Date
  category?: (typeof category)[number]
}
