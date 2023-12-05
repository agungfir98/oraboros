export interface BudgetType {
  tag: string
  name: string
  amount: number
}

export interface BudgetDb extends BudgetType {
  timestamp: Date
}
