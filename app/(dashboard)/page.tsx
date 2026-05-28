'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { COMPLAINT_STATUS } from '@/lib/utils/constants'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    upcomingAppointments: 0,
    activeEnforcement: 0
  })
  const [recentComplaints, setRecentComplaints] = useState([])
  const supabase = createClient()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Get complaints count
    const { count: totalComplaints } = await supabase
      .from('complaints')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    const { count: pendingComplaints } = await supabase
      .from('complaints')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .in('status', ['pending', 'reviewing'])

    const { data: appointments } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'confirmed')
      .gte('preferred_date', new Date().toISOString().split('T')[0])
      .limit(5)

    const { data: complaints } = await supabase
      .from('complaints')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    setStats({
      totalComplaints: totalComplaints || 0,
      pendingComplaints: pendingComplaints || 0,
      upcomingAppointments: appointments?.length || 0,
      activeEnforcement: 0
    })
    setRecentComplaints(complaints || [])
  }

  const statCards = [
    { title: 'Total Complaints', value: stats.totalComplaints, icon: '📋', color: 'bg-blue-500' },
    { title: 'Pending Review', value: stats.pendingComplaints, icon: '⏳', color: 'bg-yellow-500' },
    { title: 'Upcoming Appointments', value: stats.upcomingAppointments, icon: '📅', color: 'bg-purple-500' },
    { title: 'Quick Actions', value: 'New', icon: '➕', color: 'bg-green-500', link: '/complaints/new' }
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to CMB Portal</h1>
        <p className="text-gray-600">Track your complaints, schedule mediations, and resolve disputes amicably.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} text-white p-3 rounded-full text-2xl`}>
                {stat.icon}
              </div>
            </div>
            {stat.link && (
              <Link href={stat.link} className="mt-4 inline-block text-sm text-green-600 hover:text-green-700">
                File New Complaint →
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Recent Complaints */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Recent Complaints</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Complaint #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentComplaints.map((complaint: any) => (
                <tr key={complaint.id}>
                  <td className="px-6 py-4 text-sm font-mono">{complaint.complaint_number}</td>
                  <td className="px-6 py-4 text-sm">{complaint.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${COMPLAINT_STATUS[complaint.status as keyof typeof COMPLAINT_STATUS]?.color} text-white`}>
                      {COMPLAINT_STATUS[complaint.status as keyof typeof COMPLAINT_STATUS]?.label || complaint.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(complaint.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/complaints/${complaint.id}`} className="text-green-600 hover:text-green-900">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}