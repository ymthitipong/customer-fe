import Navbar from '@/components/nav-bar'
import type { ReactNode } from 'react'
import { Suspense } from 'react'

export default function CustomersLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Suspense>{children}</Suspense>
      </main>
    </div>
  )
}
