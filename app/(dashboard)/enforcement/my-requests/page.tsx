'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Shield, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { timeAgo } from '@/lib/utils/helpers'
import { EnforcementRequest } from '@/types'

export default function MyEnforcementRequestsPage() {
  const [requests, setRequests] = useState<EnforcementRequest[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetch = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('enforcement_requests')
        .select('*, complaint:complaints(title, case_number)')
        .eq('complainant_id', user.id)
        .order('created_at', { ascending: false })
      setRequests(data || [])
      setLoading(false)
    }
    fetch()
  }, [])

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Enforcement Requests</h1>
        <p className="text-gray-500 text-sm mt-1">{requests.length} total requests</p>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 text-center py-20">
          <Shield className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-1">No enforcement requests</h3>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">
            Enforcement requests can be filed when a resolved case agreement has not been honoured.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
          {requests.map(req => (
            <Link key={req.id} href={`/dashboard/enforcement/${req.id}`}
              className="flex items-start gap-4 px-6 py-5 hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-900">{(req as any).complaint?.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Enforcement No: <span className="font-mono">{req.enforcement_number}</span>
                    </p>
                  </div>
                  <StatusBadge type="enforcement" status={req.status} />
                </div>
                <p className="text-xs text-gray-400 mt-2">Filed {timeAgo(req.created_at)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
