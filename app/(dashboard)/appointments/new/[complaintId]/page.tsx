'use client'
export const dynamic = 'force-dynamic'


import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AppointmentForm } from '@/components/forms/AppointmentForm'
import { Complaint } from '@/types'

export default function NewAppointmentPage() {
  const { complaintId } = useParams()
  const [complaint, setComplaint] = useState<Complaint | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('complaints').select('*').eq('id', complaintId).single().then(({ data }) => setComplaint(data))
  }, [complaintId])

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href={`/dashboard/complaints/${complaintId}`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Complaint
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Book a Mediation Session</h1>
        {complaint && <p className="text-gray-500 text-sm mt-1">For case: <span className="font-medium text-gray-700">{complaint.title}</span></p>}
      </div>
      <AppointmentForm complaintId={complaintId as string} />
    </div>
  )
}
