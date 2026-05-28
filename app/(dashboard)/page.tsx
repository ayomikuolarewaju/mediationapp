'use client'
export const dynamic = 'force-dynamic'


import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileText, Calendar, Shield, CheckCircle, Clock, AlertCircle, Plus, ArrowRight, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatDate, timeAgo } from '@/lib/utils/helpers'
import { Complaint, Appointment } from '@/types'

export default function DashboardPage() {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, appointments: 0 })
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([])
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [complaintsRes, appointmentsRes] = await Promise.all([
        supabase.from('complaints').select('*').eq('complainant_id', user.id).order('created_at', { ascending: false }),
        supabase.from('appointments').select('*, complaint:complaints(title,case_number)').eq('complainant_id', user.id).gte('scheduled_date', new Date().toISOString().split('T')[0]).order('scheduled_date', { ascending: true }).limit(3),
      ])

      const complaints = complaintsRes.data || []
      setRecentComplaints(complaints.slice(0, 5))
      setUpcomingAppointments(appointmentsRes.data || [])
      setStats({
        total: complaints.length,
        pending: complaints.filter(c => !['resolved', 'closed'].includes(c.status)).length,
        resolved: complaints.filter(c => c.status === 'resolved').length,
        appointments: (appointmentsRes.data || []).length,
      })
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>
  )

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{greeting}, {profile?.full_name?.split(' ')[0]} 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Here's an overview of your cases and activity.</p>
        </div>
        <Link href="/dashboard/complaints/new" className="flex items-center gap-2 bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-800 transition-colors">
          <Plus className="w-4 h-4" /> New Complaint
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Cases', value: stats.total, icon: FileText, color: 'bg-blue-50 text-blue-600', iconBg: 'bg-blue-100' },
          { label: 'Active Cases', value: stats.pending, icon: Clock, color: 'bg-yellow-50 text-yellow-600', iconBg: 'bg-yellow-100' },
          { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'bg-green-50 text-green-600', iconBg: 'bg-green-100' },
          { label: 'Upcoming Sessions', value: stats.appointments, icon: Calendar, color: 'bg-purple-50 text-purple-600', iconBg: 'bg-purple-100' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.iconBg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color.split(' ')[1]}`} />
              </div>
              <TrendingUp className="w-4 h-4 text-gray-300" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Complaints */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Complaints</h2>
            <Link href="/dashboard/complaints/my-complaints" className="text-green-700 text-sm font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentComplaints.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No complaints filed yet</p>
              <Link href="/dashboard/complaints/new" className="text-green-700 text-sm font-medium mt-2 inline-block hover:underline">
                File your first complaint →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentComplaints.map(complaint => (
                <Link key={complaint.id} href={`/dashboard/complaints/${complaint.id}`} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-green-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{complaint.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{complaint.case_number} · {timeAgo(complaint.created_at)}</p>
                  </div>
                  <StatusBadge type="complaint" status={complaint.status} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Appointments + Quick Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Upcoming Sessions</h2>
            </div>
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-10">
                <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-xs">No upcoming sessions</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {upcomingAppointments.map(apt => (
                  <Link key={apt.id} href={`/dashboard/appointments/${apt.id}`} className="block px-6 py-4 hover:bg-gray-50">
                    <p className="text-sm font-medium text-gray-900 truncate">{(apt as any).complaint?.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-green-600" />
                      <p className="text-xs text-gray-500">{formatDate(apt.scheduled_date)} at {apt.scheduled_time}</p>
                    </div>
                    <StatusBadge type="appointment" status={apt.status} className="mt-2" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-green-900 rounded-2xl p-5 text-white">
            <h3 className="font-semibold mb-4 text-sm">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { href: '/dashboard/complaints/new', label: 'File a Complaint', icon: FileText },
                { href: '/dashboard/appointments/my-appointments', label: 'View Appointments', icon: Calendar },
                { href: '/dashboard/enforcement/my-requests', label: 'Enforcement Requests', icon: Shield },
              ].map(action => (
                <Link key={action.href} href={action.href} className="flex items-center gap-3 p-3 bg-green-800 rounded-xl hover:bg-green-700 transition-colors text-sm">
                  <action.icon className="w-4 h-4 text-yellow-400" />
                  {action.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
