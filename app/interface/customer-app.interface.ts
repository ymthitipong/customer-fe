export type SortField =
  | 'name'
  | 'total_spend'
  | 'number_of_purchases'
  | 'status'
  | 'last_activity'
export type SortOrder = 'asc' | 'desc'

export type CreditStatus = 'No Credit' | 'Good Credit' | 'Poor Credit';
export interface Activity {
  action: string
  time: string
  displayTime: string
}
export type CustomerStatus = 'Active' | 'Inactive';

// todo : seperate customer and customer be res interface
export interface Customer {
  id: number
  name: string
  company: string
  initials: string
  activeSince: string
  email: string
  phone: string
  salesperson: string
  creditStatus: CreditStatus
  status: CustomerStatus,
  totalSpend: number
  numberOfPurchases: number
  recentActivity: Activity[]
}

export interface Customers {
  customers: Customer[]
  total:     number
  page:      number
  limit:     number
}

export type CustomerTableItem = Pick<
  Customer,
  | 'id'
  | 'name'
  | 'company'
  | 'email'
  | 'phone'
  | 'salesperson'
  | 'creditStatus'
  | 'totalSpend'
  | 'numberOfPurchases'
  | 'recentActivity'
>

export interface CustomersSearchOptionsParams {
  name?: string
  company?:      string
  salesperson?:  string
}

export interface SearchCustomersParams extends CustomersSearchOptionsParams {
  sortBy:    SortField
  sortOrder: SortOrder
  page:      number
  limit:     number
}