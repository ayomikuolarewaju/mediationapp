'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { FileText, Calendar, Shield, Users, CheckCircle, Clock, TrendingUp, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { timeAgo } from '@/lib/utils/helpers'
import { CATEGORY_LABELS } from '@/lib/utils/constants'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ complaints: 0, pending: 0, resolved: 0, appointments: 0, enforcement: 0, users: 0 })
  const [recentComplaints, setRecentComplaints] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetch = async () => {
      const [cRes, aRes, eRes, uRes] = await Promise.all([
        supabase.from('complaints').select('id, status, title, case_number, category, created_at, lga'),
        supabase.from('appointments').select('id, status'),
        supabase.from('enforcement_requests').select('id, status'),
        supabase.from('profiles').select('id'),
      ])
      const complaints = cRes.data || []
      setStats({
        complaints: complaints.length,
        pending: complaints.filter((c: any) => !['resolved','closed'].includes(c.status)).length,
        resolved: complaints.filter((c: any) => c.status === 'resolved').length,
        appointments: (aRes.data || []).length,
        enforcement: (eRes.data || []).length,
        users: (uRes.data || []).length,
      })
      setRecentComplaints(complaints.slice(-8).reverse())
      setLoading(false)
    }
    fetch()
  }, [])

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of all CMB cases and activities</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: 'Total Cases', value: stats.complaints, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Active Cases', value: stats.pending, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
          { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
          { label: 'Appointments', value: stats.appointments, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-100' },
          { label: 'Enforcement', value: stats.enforcement, icon: Shield, color: 'text-orange-600', bg: 'bg-orange-100' },
          { label: 'Citizens', value: stats.users, icon: Users, color: 'text-pink-600', bg: 'bg-pink-100' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.bg}`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent complaints table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Complaints</h2>
          <Link href="/admin/complaints" className="text-green-700 text-sm font-medium hover:underline">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Case No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">LGA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Filed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentComplaints.map((c: any) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-gray-600">{c.case_number}</td>
                  <td className="px-6 py-4">
                    <Link href={`/dashboard/complaints/${c.id}`} className="font-medium text-gray-900 hover:text-green-700 truncate max-w-[200px] block">
                      {c.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{CATEGORY_LABELS[c.category as keyof typeof CATEGORY_LABELS]}</td>
                  <td className="px-6 py-4 text-gray-600">{c.lga}</td>
                  <td className="px-6 py-4"><StatusBadge type="complaint" status={c.status} /></td>
                  <td className="px-6 py-4 text-gray-400 text-xs">{timeAgo(c.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
