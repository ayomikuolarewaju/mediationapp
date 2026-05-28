'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatDate } from '@/lib/utils/helpers'
import { AppointmentStatus } from '@/types'
import Link from 'next/link'

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('appointments')
      .select('*, complaint:complaints(title, case_number), complainant:profiles!complainant_id(full_name)')
      .order('scheduled_date', { ascending: true })
      .then(({ data }) => { setAppointments(data || []); setLoading(false) })
  }, [])

  const updateStatus = async (id: string, status: AppointmentStatus) => {
    await supabase.from('appointments').update({ status }).eq('id', id)
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a))
    if (status === 'completed') {
      const apt = appointments.find(a => a.id === id)
      if (apt) await supabase.from('complaints').update({ status: 'resolved' }).eq('id', apt.complaint_id)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Appointments</h1>
        <p className="text-gray-500 text-sm mt-1">{appointments.length} total sessions</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {appointments.map(apt => (
          <div key={apt.id} className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-start justify-between gap-2 mb-4">
              <p className="font-semibold text-gray-900 text-sm truncate">{apt.complaint?.title}</p>
              <StatusBadge type="appointment" status={apt.status} />
            </div>
            <p className="text-xs text-gray-400 mb-4">By: {apt.complainant?.full_name}</p>
            <div className="space-y-2 text-xs text-gray-600 mb-4">
              <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-green-600" />{formatDate(apt.scheduled_date)}</div>
              <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-green-600" />{apt.scheduled_time}</div>
              <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-green-600" />{apt.location}</div>
            </div>
            <select value={apt.status} onChange={e => updateStatus(apt.id, e.target.value as AppointmentStatus)}
              className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-green-500">
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rescheduled">Rescheduled</option>
            </select>
          </div>
        ))}
      </div>

      {appointments.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 text-center py-20 text-gray-500">
          No appointments found
        </div>
      )}
    </div>
  )
}
