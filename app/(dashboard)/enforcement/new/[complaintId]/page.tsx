'use client'
export const dynamic = 'force-dynamic'


import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { EnforcementForm } from '@/components/forms/EnforcementForm'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Complaint } from '@/types'

export default function NewEnforcementPage() {
  const { complaintId } = useParams()
  const [complaint, setComplaint] = useState<Complaint | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('complaints').select('*').eq('id', complaintId).single()
      .then(({ data }) => { setComplaint(data); setLoading(false) })
  }, [complaintId])

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
  if (!complaint) return <div className="text-center py-20 text-gray-500">Complaint not found.</div>

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href={`/dashboard/complaints/${complaintId}`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Complaint
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Request Enforcement</h1>
        <p className="text-gray-500 text-sm mt-1">Initiate legal enforcement when mediation has not been successful.</p>
      </div>
      <EnforcementForm complaint={complaint} />
    </div>
  )
}
