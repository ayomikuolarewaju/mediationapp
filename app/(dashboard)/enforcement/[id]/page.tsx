'use client'
export const dynamic = 'force-dynamic'


import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Shield, FileText, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatDate } from '@/lib/utils/helpers'
import { ENFORCEMENT_STATUS_LABELS } from '@/lib/utils/constants'
import { EnforcementRequest } from '@/types'

const ENF_STEPS = ['submitted','under_review','forwarded_to_court','in_progress','resolved']

export default function EnforcementDetailPage() {
  const { id } = useParams()
  const [request, setRequest] = useState<EnforcementRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('enforcement_requests').select('*, complaint:complaints(*)')
      .eq('id', id).single()
      .then(({ data }) => { setRequest(data); setLoading(false) })
  }, [id])

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
  if (!request) return <div className="text-center py-20 text-gray-500">Request not found.</div>

  const currentStep = ENF_STEPS.indexOf(request.status)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link href="/dashboard/enforcement/my-requests" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Requests
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Enforcement Request</h1>
            <p className="text-gray-500 text-sm mt-1 font-mono">{request.enforcement_number}</p>
          </div>
          <StatusBadge type="enforcement" status={request.status} className="text-sm px-3 py-1" />
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-6 text-sm">Enforcement Progress</h2>
        <div className="relative">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200" />
          <div className="absolute top-4 left-0 h-0.5 bg-orange-500 transition-all"
            style={{ width: `${(Math.max(currentStep, 0) / (ENF_STEPS.length - 1)) * 100}%` }} />
          <div className="relative flex justify-between">
            {ENF_STEPS.map((step, i) => {
              const done = i <= currentStep
              return (
                <div key={step} className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 bg-white ${done ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`}>
                    {done ? <span className="text-white text-xs">✓</span> : <span className="text-gray-400 text-xs">{i+1}</span>}
                  </div>
                  <p className={`text-xs text-center max-w-[80px] ${i === currentStep ? 'font-semibold text-orange-600' : done ? 'text-gray-600' : 'text-gray-400'}`}>
                    {ENFORCEMENT_STATUS_LABELS[step as keyof typeof ENFORCEMENT_STATUS_LABELS]}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Request Details</h2>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Filed On</p>
          <p className="text-gray-900 text-sm mt-0.5">{formatDate(request.created_at)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Reason for Enforcement</p>
          <p className="text-gray-700 text-sm mt-0.5 leading-relaxed">{request.reason}</p>
        </div>
        {request.court_reference && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Court Reference</p>
            <p className="text-gray-900 font-mono text-sm mt-0.5">{request.court_reference}</p>
          </div>
        )}
        {request.notes && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">CMB Notes</p>
            <p className="text-gray-700 text-sm mt-0.5">{request.notes}</p>
          </div>
        )}
      </div>

      {/* Related case */}
      {(request as any).complaint && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 text-sm">Related Case</h2>
          <Link href={`/dashboard/complaints/${(request as any).complaint.id}`}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors">
            <div>
              <p className="font-medium text-gray-900">{(request as any).complaint.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{(request as any).complaint.case_number}</p>
            </div>
            <StatusBadge type="complaint" status={(request as any).complaint.status} />
          </Link>
        </div>
      )}
    </div>
  )
}
