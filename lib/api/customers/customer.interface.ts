type CreditStatus = 'No Credit' | 'Good Credit' | 'Poor Credit';
type CustomerOrderByType = 
  | 'name_asc'
  | 'name_desc'
  | 'total_spend_asc'
  | 'total_spend_desc'
  | 'number_of_purchases_asc'
  | 'number_of_purchases_desc'
  | 'status_asc'
  | 'status_desc'
  | 'last_activity_asc'
  | 'last_activity_desc'
type CustomerStatus = 'Active' | 'Inactive';

export interface CustomerResponseInterface {
  object: 'customer';
  id: number;
  name: string;
  company: string;
  initials: string;
  active_since: string;
  email: string;
  phone: string;
  salesperson: string;
  credit_status: CreditStatus;
  status: CustomerStatus;
  total_spend: number;
  number_of_purchases: number;
  last_activity: string;
  recent_activity: {
    action: string;
    time: string;
    displayTime: string;
  }[];
}

export interface CustomerListResponseInterface {
  object: 'list';
  page: number;
  limit: number;
  order: CustomerOrderByType;
  total: number;
  data: CustomerResponseInterface[];
}
