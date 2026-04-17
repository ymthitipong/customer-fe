import { CustomerListResponseInterface, CustomerResponseInterface } from "@/lib/api/customers/customer.interface";
import { Customer, Customers, SortField, SortOrder } from "../interface/customer-app.interface";

export const fromResponseToCustomer = (res: CustomerResponseInterface): Customer => {
  return {
    id: res.id,
    name: res.name,
    company: res.company,
    initials: res.initials,
    activeSince: res.active_since,
    email: res.email,
    phone: res.phone,
    salesperson: res.salesperson,
    creditStatus: res.credit_status,
    status: res.status,
    totalSpend: res.total_spend,
    numberOfPurchases: res.number_of_purchases,
    recentActivity: res.recent_activity,
  }
}
export const fromResponseToCustomers = (res: CustomerListResponseInterface): Customers => {
  return {
    customers: res.data.map(fromResponseToCustomer),
    total: res.total,
    page: res.page,
    limit: res.limit,
  }
}

const sortOrder: SortOrder[] = ['asc', 'desc']
const sortField: SortField[] = ['name', 'total_spend', 'number_of_purchases', 'status', 'last_activity']
export const transformSortBy = (by: unknown): SortField => {
  if (by && typeof by === 'string' && sortField.includes(by as SortField)) {
    return by as SortField
  }
  return 'name'
}
export const transformSortOrder = (order: unknown): SortOrder => {
  if (order && typeof order === 'string' && sortOrder.includes(order as SortOrder)) {
    return order as SortOrder
  }
  return 'asc'
}