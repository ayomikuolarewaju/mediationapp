import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'
import { ComplaintStatus, AppointmentStatus, EnforcementStatus } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  return format(new Date(date), 'dd MMM yyyy')
}

export function formatDateTime(date: string) {
  return format(new Date(date), 'dd MMM yyyy, h:mm a')
}

export function timeAgo(date: string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function getComplaintStatusColor(status: ComplaintStatus): string {
  const colors: Record<ComplaintStatus, string> = {
    submitted: 'bg-blue-100 text-blue-800',
    under_review: 'bg-yellow-100 text-yellow-800',
    mediation_scheduled: 'bg-purple-100 text-purple-800',
    mediation_in_progress: 'bg-indigo-100 text-indigo-800',
    resolved: 'bg-green-100 text-green-800',
    enforcement_requested: 'bg-orange-100 text-orange-800',
    enforcement_in_progress: 'bg-red-100 text-red-800',
    closed: 'bg-gray-100 text-gray-800',
  }
  return colors[status]
}

export function getAppointmentStatusColor(status: AppointmentStatus): string {
  const colors: Record<AppointmentStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    rescheduled: 'bg-purple-100 text-purple-800',
  }
  return colors[status]
}

export function getEnforcementStatusColor(status: EnforcementStatus): string {
  const colors: Record<EnforcementStatus, string> = {
    submitted: 'bg-blue-100 text-blue-800',
    under_review: 'bg-yellow-100 text-yellow-800',
    forwarded_to_court: 'bg-orange-100 text-orange-800',
    in_progress: 'bg-purple-100 text-purple-800',
    resolved: 'bg-green-100 text-green-800',
    dismissed: 'bg-gray-100 text-gray-800',
  }
  return colors[status]
}

export function truncate(str: string, length: number) {
  return str.length > length ? str.slice(0, length) + '...' : str
}
