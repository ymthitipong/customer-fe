import type { CreditStatus } from '@/app/interface/customer-app.interface'

interface CreditBadgeProps {
  status: CreditStatus
}

const styleMap: Record<CreditStatus, string> = {
  'No Credit':      'bg-gray-50 text-gray-700 ring-1 ring-gray-200',
  'Good Credit':      'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  'Poor Credit':      'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
}

const dotMap: Record<CreditStatus, string> = {
  'No Credit':      'bg-gray-500',
  'Good Credit':      'bg-emerald-500',
  'Poor Credit':      'bg-orange-500',
}

export default function CreditBadge({ status }: CreditBadgeProps) {
  const cls = styleMap[status] ?? 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'
  const dot = dotMap[status]  ?? 'bg-gray-400'

  return (
    <span className={`badge gap-1.5 ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  )
}
