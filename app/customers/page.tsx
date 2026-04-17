'use client'

import type {
  Customer,
  CustomersSearchOptionsParams,
  SearchCustomersParams,
  SortField,
  SortOrder
} from '@/app/interface/customer-app.interface'
import CreditBadge from '@/components/credit-badge'
import { getCustomers } from '@/lib/api/customers/get-customers'
import Link from 'next/link'
import { useState } from 'react'
import { fromResponseToCustomers } from './customers-response-map'

const PAGE_LIMIT = 20

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: 'name',                label: 'Customer Name' },
  { value: 'total_spend',         label: 'Total Spend' },
  { value: 'number_of_purchases', label: 'Number of Purchases' },
  { value: 'status',              label: 'Status' },
  { value: 'last_activity',       label: 'Last Activity' },
]

function formatCurrency(n: number) {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(n)
}

// ---------------------------------------------------------------------------
export default function CustomersPage() {
  // search form state
  const [form, setForm] = useState<CustomersSearchOptionsParams>({})
  const [sortBy, setSortBy]       = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [formError, setFormError] = useState('')

  // --- active search state (params used for the current result set)
  const [activeSearchParams, setActiveSearchParams] = useState<SearchCustomersParams | null>(null)

  // --- table result state
  const [customers, setCustomers] = useState<Customer[]>([])
  const [total, setTotal]         = useState(0)
  const [page, setPage]           = useState(1)
  const [loading, setLoading]     = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const totalPages = Math.ceil(total / PAGE_LIMIT)

  async function fetchPage(params: SearchCustomersParams) {
    const { name, company, salesperson, sortBy, sortOrder, limit, page } = params
    setLoading(true)
    try {
      const { data } = await getCustomers({ 
        name,
        company,
        salesperson,
      }, { 
        order: { by: sortBy, direction: sortOrder }, 
        page: page, 
        limit, 
      })
      
      const { customers, total } = fromResponseToCustomers(data!)
      setCustomers(customers)
      setTotal(total)
      setPage(page)
    } finally {
      setLoading(false)
    }
  }

  function handleSearch() {
    const { name, company, salesperson } = form
    if (!name?.trim() && !company?.trim() && !salesperson?.trim()) {
      setFormError('Please fill in at least one search field.')
      return
    }
    setFormError('')

    const params: SearchCustomersParams = {
      name:        name?.trim() || undefined,
      company:     company?.trim() || undefined,
      salesperson: salesperson?.trim() || undefined,
      sortBy,
      sortOrder,
      page: 1,
      limit: PAGE_LIMIT,
    }

    setActiveSearchParams(params)
    setHasSearched(true)
    fetchPage(params)
  }

  function handlePageChange(toPage: number) {
    if (!activeSearchParams || toPage < 1 || toPage > totalPages) return
    fetchPage({ ...activeSearchParams, page: toPage })
  }

  // -------------------------------------------------------------------------
  return (
    <>

        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-brand-text">Customers</h1>
          <p className="text-sm text-gray-500 mt-0.5">Search and filter your customer list</p>
        </div>

        {/* ── Search & Sort panel ── */}
        <div className="card px-6 py-5 mb-6">
          {/* Search inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-brand-text mb-1">Customer Name</label>
              <input
                type="text"
                className="input-field text-sm py-2"
                placeholder="e.g. Somchai"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-text mb-1">Company</label>
              <input
                type="text"
                className="input-field text-sm py-2"
                placeholder="e.g. Bangkok Tech"
                value={form.company}
                onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-text mb-1">Salesperson</label>
              <input
                type="text"
                className="input-field text-sm py-2"
                placeholder="e.g. Aree"
                value={form.salesperson}
                onChange={e => setForm(f => ({ ...f, salesperson: e.target.value }))}
              />
            </div>
          </div>

          {/* Sort + Search button row */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-3">
            <div className="sm:w-64">
              <label className="block text-xs font-medium text-brand-text mb-1">Sort by</label>
              <div className="flex gap-2">
                <select
                  className="input-field text-sm py-2 flex-1"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as SortField)}
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
                  className="btn-secondary px-3 py-2 text-xs"
                  title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                >
                  {sortOrder === 'asc' ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={handleSearch}
              disabled={loading}
              className="btn-primary px-6 py-2 text-sm self-end"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Searching…
                </span>
              ) : 'Search'}
            </button>
          </div>

          {/* Validation error */}
          {formError && (
            <p className="mt-3 text-xs text-red-600 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {formError}
            </p>
          )}
        </div>

        {/* ── Results ── */}
        {hasSearched && (
          <>
            {/* Result meta */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs sm:text-sm text-gray-500">
                {loading ? 'Loading…' : `${total} result${total !== 1 ? 's' : ''} — page ${page} of ${totalPages || 1}`}
              </p>
            </div>

            {/* Loading state */}
            {loading ? (
              <div className="card flex items-center justify-center py-20 gap-3 mb-4">
                <svg className="w-5 h-5 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-sm text-gray-500">Loading customers…</span>
              </div>
            ) : customers.length === 0 ? (
              <div className="card text-center py-16 mb-4">
                <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-sm text-gray-500">No customers found.</p>
              </div>
            ) : (
              <>
                {/* ── Desktop table ── */}
                <div className="data-table card overflow-hidden mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/60">
                        {['Customer','Company','Credit Status','Salesperson','Total Spend','Purchases','Last Activity'].map(h => (
                          <th key={h} className="text-left px-4 py-3 font-medium text-gray-500 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {customers.map(c => {
                        const lastAct = c.recentActivity?.[0]
                        return (
                          <tr key={c.id} className="hover:bg-primary/[0.02] transition-colors cursor-pointer">
                            <td className="px-4 py-3.5">
                              <Link href={`/customers/${c.id}`} className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary flex-shrink-0">
                                  {c.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-medium text-brand-text hover:text-primary transition-colors">{c.name}</p>
                                  <p className="text-xs text-gray-400">{c.email}</p>
                                </div>
                              </Link>
                            </td>
                            <td className="px-4 py-3.5 text-gray-600">{c.company}</td>
                            <td className="px-4 py-3.5"><CreditBadge status={c.creditStatus} /></td>
                            <td className="px-4 py-3.5 text-gray-600">{c.salesperson}</td>
                            <td className="px-4 py-3.5 font-medium text-brand-text whitespace-nowrap">{formatCurrency(c.totalSpend)}</td>
                            <td className="px-4 py-3.5 text-gray-600 text-center">{c.numberOfPurchases}</td>
                            <td className="px-4 py-3.5">
                              {lastAct ? (
                                <div>
                                  <p className="text-xs text-gray-600 line-clamp-1 max-w-[160px]">{lastAct.action}</p>
                                  <p className="text-xs text-gray-400 mt-0.5">{lastAct.displayTime}</p>
                                </div>
                              ) : <span className="text-gray-400">—</span>}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* ── Mobile cards ── */}
                <div className="data-cards card mb-4">
                  {customers.map(c => {
                    const lastAct = c.recentActivity?.[0]
                    return (
                      <Link
                        key={c.id}
                        href={`/customers/${c.id}`}
                        className="flex items-start gap-3 px-4 py-4 hover:bg-primary/[0.02] transition-colors"
                      >
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary flex-shrink-0 mt-0.5">
                          {c.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-medium text-brand-text text-sm truncate">{c.name}</p>
                            <CreditBadge status={c.creditStatus} />
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 truncate">{c.company}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span>{formatCurrency(c.totalSpend)}</span>
                            <span className="text-gray-300">·</span>
                            <span>{c.numberOfPurchases} orders</span>
                          </div>
                          {lastAct && (
                            <p className="text-xs text-gray-400 mt-1 truncate">{lastAct.action} · {lastAct.displayTime}</p>
                          )}
                        </div>
                        <svg className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )
                  })}
                </div>
              </>
            )}

            {/* ── Pagination ── */}
            {totalPages > 1 && !loading && (
              <div className="flex items-center justify-center gap-1 sm:gap-1.5 mb-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  className="btn-ghost px-2.5 sm:px-3 py-1.5 text-xs disabled:opacity-40"
                >
                  ← Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...')
                    acc.push(p)
                    return acc
                  }, [])
                  .map((p, i) =>
                    p === '...' ? (
                      <span key={`ellipsis-${i}`} className="px-1.5 text-gray-400 text-xs">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p as number)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          p === page ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                  className="btn-ghost px-2.5 sm:px-3 py-1.5 text-xs disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            )}
        </>
        )}
    </>
  )
}
