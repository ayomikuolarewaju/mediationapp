'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { complaintSchema, ComplaintInput } from '@/lib/validations/schemas'
import { createClient } from '@/lib/supabase/client'
import { LGA_LIST, CATEGORY_LABELS, generateCaseNumber } from '@/lib/utils/constants'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useToast } from '@/components/shared/Toast'
import { AlertCircle } from 'lucide-react'

export function ComplaintForm() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ComplaintInput>({
    resolver: zodResolver(complaintSchema),
  })

  const onSubmit = async (data: ComplaintInput) => {
    setServerError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data: complaint, error } = await supabase.from('complaints').insert({
      complainant_id: user.id,
      case_number: generateCaseNumber(),
      title: data.title,
      category: data.category,
      description: data.description,
      respondent_name: data.respondent_name,
      respondent_phone: data.respondent_phone,
      respondent_address: data.respondent_address,
      lga: data.lga,
      status: 'submitted',
    }).select().single()

    if (error) { setServerError(error.message); return }
    toast('Complaint filed successfully! Your case number has been assigned.', 'success')
    router.push(`/dashboard/complaints/${complaint.id}`)
  }

  const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5"
  const errorClass = "text-red-500 text-xs mt-1"

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="flex gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {serverError}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide text-green-700">Complaint Details</h3>

        <div>
          <label className={labelClass}>Complaint Title *</label>
          <input {...register('title')} className={inputClass} placeholder="Brief title describing the dispute" />
          {errors.title && <p className={errorClass}>{errors.title.message}</p>}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Category *</label>
            <select {...register('category')} className={inputClass}>
              <option value="">Select category</option>
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            {errors.category && <p className={errorClass}>{errors.category.message}</p>}
          </div>
          <div>
            <label className={labelClass}>LGA Where Dispute Occurred *</label>
            <select {...register('lga')} className={inputClass}>
              <option value="">Select LGA</option>
              {LGA_LIST.map(lga => <option key={lga} value={lga}>{lga}</option>)}
            </select>
            {errors.lga && <p className={errorClass}>{errors.lga.message}</p>}
          </div>
        </div>

        <div>
          <label className={labelClass}>Description of Dispute *</label>
          <textarea
            {...register('description')}
            rows={5}
            className={inputClass}
            placeholder="Provide a detailed description of the dispute, including dates, events, and what resolution you are seeking (minimum 50 characters)..."
          />
          {errors.description && <p className={errorClass}>{errors.description.message}</p>}
        </div>
      </div>

      {/* Respondent */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-green-700">Respondent Information</h3>
        <p className="text-xs text-gray-500">The person or organisation you have a dispute with</p>

        <div>
          <label className={labelClass}>Respondent Full Name *</label>
          <input {...register('respondent_name')} className={inputClass} placeholder="Name of the other party" />
          {errors.respondent_name && <p className={errorClass}>{errors.respondent_name.message}</p>}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Phone Number <span className="text-gray-400">(Optional)</span></label>
            <input {...register('respondent_phone')} className={inputClass} placeholder="08012345678" />
          </div>
          <div>
            <label className={labelClass}>Address <span className="text-gray-400">(Optional)</span></label>
            <input {...register('respondent_address')} className={inputClass} placeholder="Respondent's address" />
          </div>
        </div>
      </div>

      {/* Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <strong>Please Note:</strong> All information provided will be kept strictly confidential. By submitting, you confirm that the information is accurate to the best of your knowledge.
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-green-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isSubmitting ? <><LoadingSpinner size="sm" /> Submitting...</> : 'Submit Complaint'}
        </button>
      </div>
    </form>
  )
}
