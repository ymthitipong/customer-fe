import axios from 'axios'

const customerApiBaseUrl = process.env.NEXT_PUBLIC_CUSTOMER_BASE_URL ?? 'http://localhost:8080'

export const customerInstance = axios.create({
  baseURL: customerApiBaseUrl,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})
