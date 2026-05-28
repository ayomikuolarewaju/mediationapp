'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, Clock, MapPin, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatDate } from '@/lib/utils/helpers'
import { Appointment } from '@/types'

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetch = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('appointments')
        .select('*, complaint:complaints(title, case_number)')
        .eq('complainant_id', user.id)
        .order('scheduled_date', { ascending: false })
      setAppointments(data || [])
      setLoading(false)
    }
    fetch()
  }, [])

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>

  const upcoming = appointments.filter(a => new Date(a.scheduled_date) >= new Date() && a.status !== 'cancelled')
  const past = appointments.filter(a => new Date(a.scheduled_date) < new Date() || a.status === 'completed')

  const AppointmentCard = ({ apt }: { apt: Appointment }) => (
    <Link href={`/dashboard/appointments/${apt.id}`}
      className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-green-200 hover:shadow-sm transition-all block">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
          <Calendar className="w-5 h-5 text-purple-700" />
        </div>
        <StatusBadge type="appointment" status={apt.status} />
      </div>
      <p className="font-semibold text-gray-900 mb-1 truncate">{(apt as any).complaint?.title}</p>
      <p className="text-xs text-gray-400 mb-3">Case: {(apt as any).complaint?.case_number}</p>
      <div className="space-y-1.5 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-green-600" />
          <span>{formatDate(apt.scheduled_date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-green-600" />
          <span>{apt.scheduled_time}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-green-600" />
          <span className="truncate">{apt.location}</span>
        </div>
      </div>
    </Link>
  )

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
        <p className="text-gray-500 text-sm mt-1">{appointments.length} total sessions</p>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 text-center py-20">
          <Calendar className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-1">No appointments yet</h3>
          <p className="text-gray-500 text-sm">Book a mediation session from any of your complaints.</p>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div>
              <h2 className="font-semibold text-gray-900 mb-4">Upcoming Sessions ({upcoming.length})</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcoming.map(apt => <AppointmentCard key={apt.id} apt={apt} />)}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <h2 className="font-semibold text-gray-700 mb-4">Past Sessions ({past.length})</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-75">
                {past.map(apt => <AppointmentCard key={apt.id} apt={apt} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
