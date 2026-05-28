'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { enforcementSchema, EnforcementInput } from '@/lib/validations/schemas'
import { createClient } from '@/lib/supabase/client'
import { generateEnforcementNumber } from '@/lib/utils/constants'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useToast } from '@/components/shared/Toast'
import { AlertTriangle, Info } from 'lucide-react'
import { Complaint } from '@/types'

export function EnforcementForm({ complaint }: { complaint: Complaint }) {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EnforcementInput>({
    resolver: zodResolver(enforcementSchema),
  })

  const onSubmit = async (data: EnforcementInput) => {
    setServerError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data: enf, error } = await supabase.from('enforcement_requests').insert({
      complaint_id: complaint.id,
      complainant_id: user.id,
      enforcement_number: generateEnforcementNumber(),
      reason: data.reason,
      status: 'submitted',
    }).select().single()

    if (error) { setServerError(error.message); return }

    await supabase.from('complaints').update({ status: 'enforcement_requested' }).eq('id', complaint.id)

    toast('Enforcement request submitted. A CMB officer will review it shortly.', 'success')
    router.push(`/dashboard/enforcement/${enf.id}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{serverError}</div>
      )}

      {/* Warning */}
      <div className="bg-orange-50 border border-orange-300 rounded-2xl p-5 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-orange-900 text-sm mb-1">Enforcement Request</p>
          <p className="text-orange-800 text-sm">This action initiates the legal enforcement process when mediation has failed or the agreed terms have not been honoured. This is a formal legal process.</p>
        </div>
      </div>

      {/* Case Reference */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-green-700 mb-4">Case Reference</h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400 text-xs">Case Number</p>
            <p className="font-mono font-semibold text-gray-900 mt-0.5">{complaint.case_number}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Case Title</p>
            <p className="font-medium text-gray-900 mt-0.5">{complaint.title}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Respondent</p>
            <p className="font-medium text-gray-900 mt-0.5">{complaint.respondent_name}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">LGA</p>
            <p className="font-medium text-gray-900 mt-0.5">{complaint.lga}</p>
          </div>
        </div>
      </div>

      {/* Reason */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-green-700 mb-4">Reason for Enforcement</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Explain why enforcement is needed *
          </label>
          <textarea
            {...register('reason')}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Describe the outcome of mediation and why enforcement action is now required. Include specific details about what agreements were broken or what the respondent has failed to do (minimum 50 characters)..."
          />
          {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason.message}</p>}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 flex gap-2">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>Your request will be reviewed by a CMB officer. You may be contacted for additional documentation. The Bureau may forward the matter to the relevant court or enforcement agency.</p>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={() => router.back()}
          className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting}
          className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
          {isSubmitting ? <><LoadingSpinner size="sm" /> Submitting...</> : 'Submit Enforcement Request'}
        </button>
      </div>
    </form>
  )
}
