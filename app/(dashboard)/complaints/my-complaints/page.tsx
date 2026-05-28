'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, FileText, Search, Filter } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatDate, timeAgo } from '@/lib/utils/helpers'
import { CATEGORY_LABELS } from '@/lib/utils/constants'
import { Complaint } from '@/types'

export default function MyComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [filtered, setFiltered] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const supabase = createClient()

  useEffect(() => {
    const fetchComplaints = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('complaints')
        .select('*')
        .eq('complainant_id', user.id)
        .order('created_at', { ascending: false })
      setComplaints(data || [])
      setFiltered(data || [])
      setLoading(false)
    }
    fetchComplaints()
  }, [])

  useEffect(() => {
    let result = complaints
    if (search) result = result.filter(c =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.case_number.toLowerCase().includes(search.toLowerCase())
    )
    if (statusFilter !== 'all') result = result.filter(c => c.status === statusFilter)
    setFiltered(result)
  }, [search, statusFilter, complaints])

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Complaints</h1>
          <p className="text-gray-500 text-sm mt-1">{complaints.length} total cases</p>
        </div>
        <Link href="/dashboard/complaints/new" className="flex items-center gap-2 bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-800 transition-colors">
          <Plus className="w-4 h-4" /> New Complaint
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title or case number..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="mediation_scheduled">Mediation Scheduled</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 text-center py-20">
          <FileText className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-1">No complaints found</h3>
          <p className="text-gray-500 text-sm mb-6">
            {complaints.length === 0 ? "You haven't filed any complaints yet." : "No complaints match your search."}
          </p>
          {complaints.length === 0 && (
            <Link href="/dashboard/complaints/new" className="inline-flex items-center gap-2 bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-green-800">
              <Plus className="w-4 h-4" /> File a Complaint
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
          {filtered.map(complaint => (
            <Link key={complaint.id} href={`/dashboard/complaints/${complaint.id}`}
              className="flex items-start gap-4 px-6 py-5 hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-green-700" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-900">{complaint.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {complaint.case_number} · {CATEGORY_LABELS[complaint.category]} · {complaint.lga}
                    </p>
                  </div>
                  <StatusBadge type="complaint" status={complaint.status} />
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-xs text-gray-400">vs. {complaint.respondent_name}</p>
                  <p className="text-xs text-gray-400">Filed {timeAgo(complaint.created_at)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
