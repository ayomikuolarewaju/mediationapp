export const COMPLAINT_TYPES = [
  { value: 'family', label: '🏠 Family Dispute', description: 'Marriage, child custody, maintenance' },
  { value: 'landlord_tenant', label: '🏢 Landlord & Tenant', description: 'Eviction, rent arrears, property' },
  { value: 'employment', label: '💼 Employment', description: 'Unfair dismissal, unpaid salaries' },
  { value: 'property', label: '📍 Property & Inheritance', description: 'Land disputes, inheritance' },
  { value: 'financial', label: '💰 Financial Claims', description: 'Unpaid debts, contract breach' }
]

export const LGA_OFFICES = [
  { value: 'Onikan', label: 'Headquarters - Onikan', address: '18, King George V Road, Onikan' },
  { value: 'Ikeja', label: 'Ikeja LGA Office', address: 'Ikeja Local Government Secretariat' },
  { value: 'Alimosho', label: 'Alimosho LGA Office', address: 'Alimosho Local Government Secretariat' },
  { value: 'Badagry', label: 'Badagry LGA Office', address: 'Badagry Local Government Secretariat' },
  { value: 'Ikorodu', label: 'Ikorodu LGA Office', address: 'Ikorodu Local Government Secretariat' },
  { value: 'Lagos Island', label: 'Lagos Island LGA Office', address: 'Lagos Island Local Government Secretariat' }
]

export const COMPLAINT_STATUS = {
  pending: { label: 'Pending Review', color: 'bg-yellow-500', icon: '⏳' },
  reviewing: { label: 'Under Review', color: 'bg-blue-500', icon: '🔍' },
  mediation_scheduled: { label: 'Mediation Scheduled', color: 'bg-purple-500', icon: '📅' },
  mediation_in_progress: { label: 'Mediation in Progress', color: 'bg-indigo-500', icon: '⚖️' },
  mediation_failed: { label: 'Mediation Failed', color: 'bg-red-500', icon: '❌' },
  resolved: { label: 'Resolved', color: 'bg-green-500', icon: '✅' },
  escalated: { label: 'Escalated', color: 'bg-orange-500', icon: '📤' }
}

export const APPOINTMENT_STATUS = {
  pending: { label: 'Pending Confirmation', color: 'bg-yellow-500' },
  confirmed: { label: 'Confirmed', color: 'bg-green-500' },
  completed: { label: 'Completed', color: 'bg-blue-500' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500' }
}