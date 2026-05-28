'use client'
export const dynamic = 'force-dynamic'


import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Shield, User, MapPin, Phone, Clock, FileText, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatDate, formatDateTime } from '@/lib/utils/helpers'
import { CATEGORY_LABELS, COMPLAINT_STATUS_LABELS } from '@/lib/utils/constants'
import { Complaint } from '@/types'

const STATUS_STEPS = [
  'submitted', 'under_review', 'mediation_scheduled', 'mediation_in_progress', 'resolved'
]

export default function ComplaintDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [complaint, setComplaint] = useState<Complaint | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasAppointment, setHasAppointment] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchComplaint = async () => {
      const { data } = await supabase.from('complaints').select('*').eq('id', id).single()
      setComplaint(data)
      if (data) {
        const { data: apt } = await supabase.from('appointments').select('id').eq('complaint_id', id).limit(1)
        setHasAppointment((apt || []).length > 0)
      }
      setLoading(false)
    }
    fetchComplaint()
  }, [id])

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
  if (!complaint) return <div className="text-center py-20 text-gray-500">Complaint not found.</div>

  const currentStepIndex = STATUS_STEPS.indexOf(complaint.status)
  const canBookAppointment = ['submitted', 'under_review'].includes(complaint.status) && !hasAppointment
  const canRequestEnforcement = complaint.status === 'resolved'

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link href="/dashboard/complaints/my-complaints" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Complaints
        </Link>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{complaint.title}</h1>
            <p className="text-gray-500 text-sm mt-1">Case No: <span className="font-mono font-medium text-gray-700">{complaint.case_number}</span></p>
          </div>
          <StatusBadge type="complaint" status={complaint.status} className="text-sm px-3 py-1" />
        </div>
      </div>

      {/* Progress tracker */}
      {!['enforcement_requested', 'enforcement_in_progress', 'closed'].includes(complaint.status) && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-6 text-sm">Case Progress</h2>
          <div className="relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200" />
            <div
              className="absolute top-4 left-0 h-0.5 bg-green-500 transition-all duration-500"
              style={{ width: `${(Math.max(currentStepIndex, 0) / (STATUS_STEPS.length - 1)) * 100}%` }}
            />
            <div className="relative flex justify-between">
              {STATUS_STEPS.map((step, i) => {
                const done = i <= currentStepIndex
                const active = i === currentStepIndex
                return (
                  <div key={step} className="flex flex-col items-center gap-2">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 bg-white ${done ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}>
                      {done ? <span className="text-white text-xs">✓</span> : <span className="text-gray-400 text-xs">{i + 1}</span>}
                    </div>
                    <p className={`text-xs text-center max-w-[70px] ${active ? 'font-semibold text-green-700' : done ? 'text-gray-600' : 'text-gray-400'}`}>
                      {COMPLAINT_STATUS_LABELS[step as keyof typeof COMPLAINT_STATUS_LABELS]}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {(canBookAppointment || canRequestEnforcement) && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
          <h3 className="font-semibold text-green-900 mb-3 text-sm">Available Actions</h3>
          <div className="flex flex-wrap gap-3">
            {canBookAppointment && (
              <Link href={`/dashboard/appointments/new/${complaint.id}`}
                className="flex items-center gap-2 bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-green-800 transition-colors">
                <Calendar className="w-4 h-4" /> Book Mediation Session
              </Link>
            )}
            {canRequestEnforcement && (
              <Link href={`/dashboard/enforcement/new/${complaint.id}`}
                className="flex items-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-orange-700 transition-colors">
                <Shield className="w-4 h-4" /> Request Enforcement
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Complaint Details */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-green-600" /> Complaint Details
          </h2>
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide">Category</p>
              <p className="text-gray-900 font-medium mt-0.5">{CATEGORY_LABELS[complaint.category]}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide">Location (LGA)</p>
              <p className="text-gray-900 font-medium mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {complaint.lga}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide">Filed On</p>
              <p className="text-gray-900 font-medium mt-0.5">{formatDate(complaint.created_at)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide">Description</p>
              <p className="text-gray-700 mt-0.5 leading-relaxed">{complaint.description}</p>
            </div>
          </div>
        </div>

        {/* Respondent Details */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-green-600" /> Respondent
          </h2>
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide">Name</p>
              <p className="text-gray-900 font-medium mt-0.5">{complaint.respondent_name}</p>
            </div>
            {complaint.respondent_phone && (
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide">Phone</p>
                <p className="text-gray-900 font-medium mt-0.5 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {complaint.respondent_phone}
                </p>
              </div>
            )}
            {complaint.respondent_address && (
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide">Address</p>
                <p className="text-gray-900 font-medium mt-0.5">{complaint.respondent_address}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
