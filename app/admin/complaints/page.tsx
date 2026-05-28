'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Filter } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { timeAgo } from '@/lib/utils/helpers'
import { CATEGORY_LABELS } from '@/lib/utils/constants'
import { Complaint, ComplaintStatus } from '@/types'

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const supabase = createClient()

  useEffect(() => {
    supabase.from('complaints')
      .select('*, profile:profiles!complainant_id(full_name, phone)')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setComplaints(data || []); setFiltered(data || []); setLoading(false) })
  }, [])

  useEffect(() => {
    let result = complaints
    if (search) result = result.filter(c =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.case_number.toLowerCase().includes(search.toLowerCase()) ||
      c.respondent_name.toLowerCase().includes(search.toLowerCase())
    )
    if (statusFilter !== 'all') result = result.filter(c => c.status === statusFilter)
    setFiltered(result)
  }, [search, statusFilter, complaints])

  const updateStatus = async (id: string, status: ComplaintStatus) => {
    await supabase.from('complaints').update({ status }).eq('id', id)
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status } : c))
  }

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Complaints</h1>
          <p className="text-gray-500 text-sm mt-1">{complaints.length} total cases</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search case, title, respondent..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
          <option value="all">All Statuses</option>
          <option value="submitted">Submitted</option>
          <option value="under_review">Under Review</option>
          <option value="mediation_scheduled">Mediation Scheduled</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Case</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Complainant</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">LGA</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Update Status</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Filed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <Link href={`/dashboard/complaints/${c.id}`} className="hover:text-green-700">
                      <p className="font-medium text-gray-900 max-w-[180px] truncate">{c.title}</p>
                      <p className="font-mono text-xs text-gray-400">{c.case_number}</p>
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-gray-900">{c.profile?.full_name}</p>
                    <p className="text-xs text-gray-400">{c.profile?.phone}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-600 text-xs">{CATEGORY_LABELS[c.category as keyof typeof CATEGORY_LABELS]}</td>
                  <td className="px-5 py-4 text-gray-600 text-xs">{c.lga}</td>
                  <td className="px-5 py-4"><StatusBadge type="complaint" status={c.status} /></td>
                  <td className="px-5 py-4">
                    <select
                      value={c.status}
                      onChange={e => updateStatus(c.id, e.target.value as ComplaintStatus)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                    >
                      <option value="submitted">Submitted</option>
                      <option value="under_review">Under Review</option>
                      <option value="mediation_scheduled">Mediation Scheduled</option>
                      <option value="mediation_in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-400">{timeAgo(c.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
