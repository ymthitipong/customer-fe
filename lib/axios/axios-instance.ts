import axios from 'axios'

const customerApiBaseUrl = process.env.NEXT_PUBLIC_CUSTOMER_BASE_URL ?? 'https://customerservice-staging.up.railway.app'

export const customerInstance = axios.create({
  baseURL: customerApiBaseUrl,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})
