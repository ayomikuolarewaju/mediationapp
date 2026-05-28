import { cn } from '@/lib/utils/helpers'
import {
  getComplaintStatusColor,
  getAppointmentStatusColor,
  getEnforcementStatusColor,
} from '@/lib/utils/helpers'
import {
  COMPLAINT_STATUS_LABELS,
  APPOINTMENT_STATUS_LABELS,
  ENFORCEMENT_STATUS_LABELS,
} from '@/lib/utils/constants'
import { ComplaintStatus, AppointmentStatus, EnforcementStatus } from '@/types'

interface StatusBadgeProps {
  type: 'complaint' | 'appointment' | 'enforcement'
  status: ComplaintStatus | AppointmentStatus | EnforcementStatus
  className?: string
}

export function StatusBadge({ type, status, className }: StatusBadgeProps) {
  let colorClass = ''
  let label = ''

  if (type === 'complaint') {
    colorClass = getComplaintStatusColor(status as ComplaintStatus)
    label = COMPLAINT_STATUS_LABELS[status as ComplaintStatus]
  } else if (type === 'appointment') {
    colorClass = getAppointmentStatusColor(status as AppointmentStatus)
    label = APPOINTMENT_STATUS_LABELS[status as AppointmentStatus]
  } else {
    colorClass = getEnforcementStatusColor(status as EnforcementStatus)
    label = ENFORCEMENT_STATUS_LABELS[status as EnforcementStatus]
  }

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      colorClass,
      className
    )}>
      {label}
    </span>
  )
}
