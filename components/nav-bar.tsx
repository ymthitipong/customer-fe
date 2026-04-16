'use client'

import { useRouter } from 'next/navigation'

export default function Navbar() {
  const router = useRouter()

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-end h-12 sm:h-14">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-secondary/20 flex items-center justify-center text-xs font-semibold text-primary">
              A
            </div>
            <span className="text-xs sm:text-sm text-gray-600">Admin</span>
            <button
              onClick={() => router.push('/login')}
              className="btn-ghost text-xs px-2.5 py-1 sm:px-3 sm:py-1.5"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
