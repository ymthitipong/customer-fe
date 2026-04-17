'use client'

import type {
  Customer,
  CustomersSearchOptionsParams,
  SearchCustomersParams,
  SortField,
  SortOrder
} from '@/app/interface/customer-app.interface'
import { getCustomers } from '@/lib/api/customers/get-customers'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { fromResponseToCustomers, transformSortBy, transformSortOrder } from './customers-response-map'

const PAGE_LIMIT = 20

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: 'name',                label: 'Customer Name' },
  { value: 'total_spend',         label: 'Total Spend' },
  { value: 'number_of_purchases', label: 'Purchases' },
  { value: 'status',              label: 'Status' },
  { value: 'last_activity',       label: 'Last Activity' },
]

const colList: { label: string; desktopOnly?: boolean; align?: 'right' }[] = [
  { label: 'Customer Name' },
  { label: 'Company Name' },
  { label: 'Salesperson' },
  { label: 'Status' },
  { label: 'Total Spend' },
  { label: 'Purchases' },
  { label: 'Last Activity' },
]

function buildSearchQuery(params: SearchCustomersParams, page: number): string {
  const query = new URLSearchParams()
  if (params.name)        query.set('name',        params.name)
  if (params.company)     query.set('company',     params.company)
  if (params.salesperson) query.set('salesperson', params.salesperson)
  query.set('sortBy',    params.sortBy)
  query.set('sortOrder', params.sortOrder)
  query.set('page',      String(page))
  return query.toString()
}

export default function CustomersPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()

  // search form state
  const [form, setForm] = useState<CustomersSearchOptionsParams>({})
  const [sortBy, setSortBy]       = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [formError, setFormError] = useState('')

  // --- active search state (params used for the current result set)
  const [activeSearchParams, setActiveSearchParams] = useState<SearchCustomersParams | null>(null)

  // --- table result state
  const [customers, setCustomers] = useState<Customer[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageInput, setPageInput] = useState('1')
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const totalPages = Math.ceil(total / PAGE_LIMIT)

  // restore state from URL query params (e.g. when returning from detail page)
  useEffect(() => {
    const name = searchParams.get('name') ?? undefined
    const company = searchParams.get('company') ?? undefined
    const salesperson = searchParams.get('salesperson') ?? undefined
    const sortByQuery = transformSortBy(searchParams.get('sortBy'))
    const sortOrderQuery = transformSortOrder(searchParams.get('sortOrder'))
    const pageQ = parseInt(searchParams.get('page') || '1', 10) ?? 1

    if (!name && !company && !salesperson) {
      setActiveSearchParams(null);
      setHasSearched(false);
      router.replace(`/customers`, { scroll: true })
      return;
    }

    setForm({ name, company, salesperson })
    setSortBy(sortByQuery)
    setSortOrder(sortOrderQuery)

    const params: SearchCustomersParams = {
      name, company, salesperson,
      sortBy: sortByQuery, sortOrder: sortOrderQuery,
      page: pageQ, limit: PAGE_LIMIT,
    }
    setActiveSearchParams(params)
    setHasSearched(true)
    fetchPage(params)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchPage(params: SearchCustomersParams) {
    const { name, company, salesperson, sortBy, sortOrder, limit, page } = params
    setLoading(true)
    try {
      const { data, statusCode } = await getCustomers({
        name,
        company,
        salesperson,
      }, {
        order: { by: sortBy, direction: sortOrder },
        page: page,
        limit,
      })

      if (!data || statusCode >= 300) {
        setLoading(false)
        return
      }

      const { customers, total } = fromResponseToCustomers(data)
      setCustomers(customers)
      setTotal(total)
      setPage(page)
      setPageInput(String(page))
      router.replace(`/customers?${buildSearchQuery(params, page)}`, { scroll: false })
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

  return (
    <>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-brand-text">Customers</h1>
            <p className="text-sm text-gray-500 mt-0.5">Search and filter your customer list</p>
          </div>
          {/* mock add customer button */}
          <button type="button" className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Customer
          </button>
        </div>

        {/* Search & Sort panel */}
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

          {/* Sort selection and Search button */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-3">
            <div>
              <label className="block text-xs font-medium text-brand-text mb-1">Sort by</label>
              <select
                className="input-field text-sm py-2"
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortField)}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-text mb-1">Sort order</label>
              <select
                className="input-field text-sm py-2"
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value as SortOrder)}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
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

          {/* search options validation error */}
          {formError && (
            <p className="mt-3 text-xs text-red-600 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {formError}
            </p>
          )}
        </div>

        {/* customer list result */}
        {hasSearched && (
          <>
            {/* header */}
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
                <div className="card overflow-hidden mb-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/60">
                        {colList.map(col => (
                          <th key={col.label} className={`${col.desktopOnly ? 'hidden sm:table-cell ' : ''}text-center px-4 py-3 font-medium text-gray-500 whitespace-nowrap`}>
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {customers.map(customer => {
                        const lastAct = customer.recentActivity?.[0]
                        // return customer rows
                        return (
                          <tr key={customer.id} className="hover:bg-primary/[0.05] transition-colors">
                            <td className="px-4 py-3.5">
                              <a
                                href={`/customers/${customer.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-brand-text hover:text-primary transition-colors whitespace-nowrap">
                                {customer.name}
                              </a>
                            </td>
                            <td className="px-4 py-3.5 text-sm text-gray-600">{customer.company}</td>
                            <td className="hidden sm:table-cell px-4 py-3.5 text-sm text-gray-600">{customer.salesperson}</td>
                            <td className="hidden sm:table-cell px-4 py-3.5 text-center">
                              <span className={`badge inline-block w-16 text-center ${customer.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {customer.status === 'Active' ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="hidden sm:table-cell px-4 py-3.5 text-sm text-gray-600 text-right tabular-nums">{customer.totalSpend}</td>
                            <td className="hidden sm:table-cell px-4 py-3.5 text-sm text-gray-600 text-right tabular-nums">{customer.numberOfPurchases}</td>
                            <td className="px-4 py-3.5">
                              {lastAct ? (
                                <div>
                                  <p className="text-xs text-gray-600 line-clamp-1 max-w-[160px]">{lastAct.action}</p>
                                  <p className="text-xs text-gray-400 mt-0.5">{lastAct.displayTime}</p>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-400">—</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
            )}

            {/* Pagination */}
            {!loading && totalPages >= 1 && (
              <div className="flex items-center justify-center gap-1.5 mb-2">

                {/* First */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={page <= 1 || totalPages === 1}
                  className="btn-ghost px-3 py-2 text-sm disabled:opacity-40"
                  title="First page"
                >
                  «
                </button>

                {/* Prev */}
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1 || totalPages === 1}
                  className="btn-ghost px-3 py-2 text-sm disabled:opacity-40"
                  title="Previous page"
                >
                  ‹
                </button>

                {/* Page input */}
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={pageInput}
                  onChange={e => setPageInput(e.target.value)}
                  onBlur={() => {
                    const n = parseInt(pageInput, 10)
                    if (!isNaN(n) && n >= 1 && n <= totalPages) {
                      handlePageChange(n)
                    } else {
                      setPageInput(String(page))
                    }
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      const n = parseInt(pageInput, 10)
                      if (!isNaN(n) && n >= 1 && n <= totalPages) {
                        handlePageChange(n)
                      } else {
                        setPageInput(String(page))
                      }
                    }
                  }}
                  className="input-field text-sm text-center py-2 w-14 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />

                {/* of total */}
                <span className="text-sm text-gray-500">of {totalPages}</span>

                {/* Next */}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages || totalPages === 1}
                  className="btn-ghost px-3 py-2 text-sm disabled:opacity-40"
                  title="Next page"
                >
                  ›
                </button>

                {/* Last */}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={page >= totalPages || totalPages === 1}
                  className="btn-ghost px-3 py-2 text-sm disabled:opacity-40"
                  title="Last page"
                >
                  »
                </button>

              </div>
            )}
        </>
        )}
    </>
  )
}