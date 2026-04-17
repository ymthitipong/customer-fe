'use client'

import type { Activity, Customer } from '@/app/interface/customer-app.interface'
import { getCustomerById } from '@/lib/api/customers/get-customer-by-id'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { fromResponseToCustomer } from '../customers-response-map'

function formatPhone(phone?: string | null): string {
  if (!phone) return '—'
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
  if (digits.length === 9)  return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`
  return phone
}

function InfoField({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex flex-col gap-1 py-3 border-b border-gray-100">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-base font-medium text-brand-text">{value ?? '—'}</p>
    </div>
  )
}

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  useEffect(() => {
    async function load() {
      const id = parseInt(params.id, 10)
      if (isNaN(id)) { setError('Invalid customer ID'); setLoading(false); return }

      const { statusCode, data } = await getCustomerById(id)
      if (statusCode >= 400 || !data) {
        setError(statusCode === 404 ? 'Customer not found.' : 'Failed to load customer.')
      } else {
        setCustomer(fromResponseToCustomer(data))
      }
      setLoading(false)
    }
    load()
  }, [params.id])

  return (
    <>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-brand-text">
          {loading ? 'Loading…' : customer?.name ?? 'Customer Detail'}
        </h1>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="card flex items-center justify-center py-24 gap-3">
          <svg className="w-5 h-5 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm text-gray-500">Loading customer…</span>
        </div>
      )}

      {/* ── Error ── */}
      {!loading && error && (
        <div className="card flex flex-col items-center justify-center py-24 gap-3">
          <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      )}

      {/* ── Content ── */}
      {!loading && customer && (
        <div className="card px-6 py-4 flex flex-col gap-5">

          {/* Customer Information */}
          <div>
            <h2 className="text-lg font-bold text-brand-text tracking-wider">Customer Information</h2>
            {/* Fields — 2 col grid */}
            <div className="grid grid-cols-2 gap-x-8">
              <InfoField label="id" value={customer.id} />
              <InfoField label="name" value={customer.name} />
              <InfoField label="company" value={customer.company} />
              <InfoField label="status" value={customer.status} />
              <InfoField label="email" value={customer.email} />
              <InfoField label="phone" value={formatPhone(customer.phone)} />
              <InfoField label="salesperson" value={customer.salesperson} />
              <InfoField label="active since" value={customer.activeSince} />
              <InfoField label="credit status" value={customer.creditStatus} />
              <InfoField label="total spend" value={customer.totalSpend} />
              <InfoField label="number of purchases" value={customer.numberOfPurchases} />
            </div>
          </div>

          <div className="border-t border-gray-100 my-2" />

          {/* Recent Activity */}
          <div>
            <h2 className="text-lg font-bold text-brand-text mb-6 tracking-wider">Recent Activity</h2>
            {customer.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {customer.recentActivity.map((act: Activity, i: number) => (
                  <div key={i} className="flex items-center gap-8">
                    <p className="text-sm text-brand-text min-w-fit">{act.displayTime}</p>
                    <p className="text-sm text-brand-text flex-1">{act.action}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No recent activity.</p>
            )}
          </div>

        </div>
      )}
    </>
  )
}