'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatDate, timeAgo } from '@/lib/utils/helpers'
import { EnforcementStatus } from '@/types'

export default function AdminEnforcementPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [courtRefs, setCourtRefs] = useState<Record<string, string>>({})
  const supabase = createClient()

  useEffect(() => {
    supabase.from('enforcement_requests')
      .select('*, complaint:complaints(title, case_number), complainant:profiles!complainant_id(full_name, phone)')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setRequests(data || []); setLoading(false) })
  }, [])

  const updateStatus = async (id: string, status: EnforcementStatus) => {
    const updates: any = { status }
    if (courtRefs[id]) updates.court_reference = courtRefs[id]
    await supabase.from('enforcement_requests').update(updates).eq('id', id)
    setRequests(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r))
  }

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Enforcement Requests</h1>
        <p className="text-gray-500 text-sm mt-1">{requests.length} total requests</p>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 text-center py-20">
          <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No enforcement requests</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <div key={req.id} className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-sm text-orange-600 font-medium">{req.enforcement_number}</span>
                    <StatusBadge type="enforcement" status={req.status} />
                  </div>
                  <p className="font-semibold text-gray-900">{req.complaint?.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Case: {req.complaint?.case_number} · By: {req.complainant?.full_name} ({req.complainant?.phone})
                  </p>
                </div>
                <p className="text-xs text-gray-400">{timeAgo(req.created_at)}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 mb-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Reason</p>
                <p>{req.reason}</p>
              </div>

              <div className="flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs text-gray-500 mb-1">Court Reference (optional)</label>
                  <input
                    value={courtRefs[req.id] || req.court_reference || ''}
                    onChange={e => setCourtRefs(prev => ({ ...prev, [req.id]: e.target.value }))}
                    placeholder="e.g. LAGOS/HC/2025/001"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Update Status</label>
                  <select value={req.status} onChange={e => updateStatus(req.id, e.target.value as EnforcementStatus)}
                    className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-green-500">
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="forwarded_to_court">Forwarded to Court</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="dismissed">Dismissed</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
