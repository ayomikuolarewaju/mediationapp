'use client'
export const dynamic = 'force-dynamic'


import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, MapPin, User, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatDate, formatDateTime } from '@/lib/utils/helpers'
import { Appointment } from '@/types'

export default function AppointmentDetailPage() {
  const { id } = useParams()
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('appointments')
      .select('*, complaint:complaints(*)')
      .eq('id', id).single()
      .then(({ data }) => { setAppointment(data); setLoading(false) })
  }, [id])

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
  if (!appointment) return <div className="text-center py-20 text-gray-500">Appointment not found.</div>

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link href="/dashboard/appointments/my-appointments" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Appointments
        </Link>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Mediation Session</h1>
          <StatusBadge type="appointment" status={appointment.status} className="text-sm px-3 py-1" />
        </div>
      </div>

      {/* Session details */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-5">Session Information</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Date</p>
              <p className="font-semibold text-gray-900 mt-0.5">{formatDate(appointment.scheduled_date)}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Time</p>
              <p className="font-semibold text-gray-900 mt-0.5">{appointment.scheduled_time}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Venue</p>
              <p className="font-semibold text-gray-900 mt-0.5">{appointment.location}</p>
              <p className="text-xs text-gray-500">{appointment.lga} LGA</p>
            </div>
          </div>
          {appointment.mediator_id && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Mediator Assigned</p>
                <p className="font-semibold text-gray-900 mt-0.5">TBA</p>
              </div>
            </div>
          )}
        </div>
        {appointment.notes && (
          <div className="mt-5 pt-5 border-t border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Your Notes</p>
            <p className="text-gray-700 text-sm">{appointment.notes}</p>
          </div>
        )}
        {appointment.outcome && (
          <div className="mt-5 pt-5 border-t border-gray-100 bg-green-50 rounded-xl p-4">
            <p className="text-xs text-green-700 uppercase tracking-wide font-semibold mb-1">Session Outcome</p>
            <p className="text-gray-700 text-sm">{appointment.outcome}</p>
          </div>
        )}
      </div>

      {/* Related complaint */}
      {(appointment as any).complaint && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-green-600" /> Related Case
          </h2>
          <Link href={`/dashboard/complaints/${(appointment as any).complaint.id}`}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors">
            <div>
              <p className="font-medium text-gray-900">{(appointment as any).complaint.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{(appointment as any).complaint.case_number}</p>
            </div>
            <StatusBadge type="complaint" status={(appointment as any).complaint.status} />
          </Link>
        </div>
      )}

      {/* What to bring */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <h3 className="font-semibold text-amber-900 mb-3">What to Bring to Your Session</h3>
        <ul className="text-sm text-amber-800 space-y-1.5">
          {['Valid government-issued ID (NIN, voter card, etc.)', 'All relevant documents related to the dispute', 'Any evidence or supporting materials', 'A list of your key points and desired outcome'].map(item => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-amber-600 mt-0.5">•</span> {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
