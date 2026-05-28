import { ComplaintCategory, ComplaintStatus, AppointmentStatus, EnforcementStatus, LGA } from '@/types'

export const LGA_LIST: LGA[] = [
  'Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Apapa',
  'Badagry', 'Epe', 'Eti-Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye',
  'Ikeja', 'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland',
  'Mushin', 'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere'
]

export const CATEGORY_LABELS: Record<ComplaintCategory, string> = {
  family_dispute: 'Family Dispute',
  landlord_tenant: 'Landlord & Tenant',
  employment: 'Employment',
  property_inheritance: 'Property & Inheritance',
  financial_claim: 'Financial Claim',
  other: 'Other',
}

export const COMPLAINT_STATUS_LABELS: Record<ComplaintStatus, string> = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  mediation_scheduled: 'Mediation Scheduled',
  mediation_in_progress: 'Mediation In Progress',
  resolved: 'Resolved',
  enforcement_requested: 'Enforcement Requested',
  enforcement_in_progress: 'Enforcement In Progress',
  closed: 'Closed',
}

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
  rescheduled: 'Rescheduled',
}

export const ENFORCEMENT_STATUS_LABELS: Record<EnforcementStatus, string> = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  forwarded_to_court: 'Forwarded to Court',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  dismissed: 'Dismissed',
}

export const CMC_OFFICES = [
  { lga: 'Lagos Island', address: '18, King George V Road, Onikan, Lagos (HQ)', phone: '08125690717' },
  { lga: 'Ikeja', address: 'Ikeja LGA Secretariat, Alausa', phone: '08165892434' },
  { lga: 'Alimosho', address: 'Alimosho LGA Secretariat', phone: '07083504679' },
  { lga: 'Badagry', address: 'Badagry LGA Secretariat', phone: '08118161620' },
  { lga: 'Ikorodu', address: 'Ikorodu LGA Secretariat', phone: '08125690717' },
]

export const generateCaseNumber = () => {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 90000) + 10000
  return `CMC/${year}/${random}`
}

export const generateEnforcementNumber = () => {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 90000) + 10000
  return `ENF/${year}/${random}`
}
