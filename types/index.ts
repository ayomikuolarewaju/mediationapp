export type UserRole = 'citizen' | 'mediator' | 'admin'

export type ComplaintStatus =
  | 'submitted'
  | 'under_review'
  | 'mediation_scheduled'
  | 'mediation_in_progress'
  | 'resolved'
  | 'enforcement_requested'
  | 'enforcement_in_progress'
  | 'closed'

export type ComplaintCategory =
  | 'family_dispute'
  | 'landlord_tenant'
  | 'employment'
  | 'property_inheritance'
  | 'financial_claim'
  | 'other'

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled'

export type EnforcementStatus =
  | 'submitted'
  | 'under_review'
  | 'forwarded_to_court'
  | 'in_progress'
  | 'resolved'
  | 'dismissed'

export type LGA =
  | 'Agege'
  | 'Ajeromi-Ifelodun'
  | 'Alimosho'
  | 'Amuwo-Odofin'
  | 'Apapa'
  | 'Badagry'
  | 'Epe'
  | 'Eti-Osa'
  | 'Ibeju-Lekki'
  | 'Ifako-Ijaiye'
  | 'Ikeja'
  | 'Ikorodu'
  | 'Kosofe'
  | 'Lagos Island'
  | 'Lagos Mainland'
  | 'Mushin'
  | 'Ojo'
  | 'Oshodi-Isolo'
  | 'Shomolu'
  | 'Surulere'

export interface Profile {
  id: string
  full_name: string
  email: string
  phone: string
  address?: string
  lga?: LGA
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Complaint {
  id: string
  case_number: string
  complainant_id: string
  respondent_name: string
  respondent_phone?: string
  respondent_address?: string
  category: ComplaintCategory
  title: string
  description: string
  status: ComplaintStatus
  lga: LGA
  assigned_mediator_id?: string
  created_at: string
  updated_at: string
  profile?: Profile
  assigned_mediator?: Profile
}

export interface Appointment {
  id: string
  complaint_id: string
  complainant_id: string
  mediator_id?: string
  scheduled_date: string
  scheduled_time: string
  location: string
  lga: LGA
  status: AppointmentStatus
  notes?: string
  outcome?: string
  created_at: string
  updated_at: string
  complaint?: Complaint
  mediator?: Profile
}

export interface EnforcementRequest {
  id: string
  complaint_id: string
  complainant_id: string
  enforcement_number: string
  reason: string
  supporting_documents?: string[]
  status: EnforcementStatus
  court_reference?: string
  notes?: string
  created_at: string
  updated_at: string
  complaint?: Complaint
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  link?: string
  created_at: string
}

export interface DashboardStats {
  totalComplaints: number
  pendingComplaints: number
  resolvedComplaints: number
  totalAppointments: number
  upcomingAppointments: number
  enforcementRequests: number
}
