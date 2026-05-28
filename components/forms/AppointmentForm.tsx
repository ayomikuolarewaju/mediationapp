'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { appointmentSchema, AppointmentInput } from '@/lib/validations/schemas'
import { createClient } from '@/lib/supabase/client'
import { LGA_LIST, CMC_OFFICES } from '@/lib/utils/constants'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useToast } from '@/components/shared/Toast'
import { MapPin, Info } from 'lucide-react'

const TIME_SLOTS = ['9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM']

export function AppointmentForm({ complaintId }: { complaintId: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  const [serverError, setServerError] = useState('')
  const today = new Date().toISOString().split('T')[0]

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<AppointmentInput>({
    resolver: zodResolver(appointmentSchema),
  })

  const selectedLGA = watch('lga')
  const office = CMC_OFFICES.find(o => o.lga === selectedLGA)

  const onSubmit = async (data: AppointmentInput) => {
    setServerError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data: apt, error } = await supabase.from('appointments').insert({
      complaint_id: complaintId,
      complainant_id: user.id,
      scheduled_date: data.scheduled_date,
      scheduled_time: data.scheduled_time,
      location: data.location,
      lga: data.lga,
      notes: data.notes,
      status: 'pending',
    }).select().single()

    if (error) { setServerError(error.message); return }

    // Update complaint status
    await supabase.from('complaints').update({ status: 'mediation_scheduled' }).eq('id', complaintId)

    toast('Mediation session booked successfully!', 'success')
    router.push(`/dashboard/appointments/${apt.id}`)
  }

  const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5"
  const errorClass = "text-red-500 text-xs mt-1"

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{serverError}</div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-green-700">Session Details</h3>

        <div>
          <label className={labelClass}>LGA Office *</label>
          <select {...register('lga')} className={inputClass}>
            <option value="">Select LGA for appointment</option>
            {LGA_LIST.map(lga => <option key={lga} value={lga}>{lga}</option>)}
          </select>
          {errors.lga && <p className={errorClass}>{errors.lga.message}</p>}
          {office && (
            <div className="mt-2 flex gap-2 text-xs text-green-700 bg-green-50 rounded-lg p-2.5">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>{office.address} · {office.phone}</span>
            </div>
          )}
        </div>

        <div>
          <label className={labelClass}>Location / Venue *</label>
          <input {...register('location')} className={inputClass} placeholder="e.g. CMB Ikeja Office, Room 3" />
          {errors.location && <p className={errorClass}>{errors.location.message}</p>}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Preferred Date *</label>
            <input {...register('scheduled_date')} type="date" min={today} className={inputClass} />
            {errors.scheduled_date && <p className={errorClass}>{errors.scheduled_date.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Preferred Time *</label>
            <select {...register('scheduled_time')} className={inputClass}>
              <option value="">Select time</option>
              {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.scheduled_time && <p className={errorClass}>{errors.scheduled_time.message}</p>}
          </div>
        </div>

        <div>
          <label className={labelClass}>Additional Notes <span className="text-gray-400">(Optional)</span></label>
          <textarea {...register('notes')} rows={3} className={inputClass} placeholder="Any special requirements or information for the mediator..." />
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 flex gap-2">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>Your appointment request will be reviewed and confirmed by a CMB officer. Both parties will be notified of the confirmed session details.</p>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={() => router.back()}
          className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting}
          className="flex-1 bg-green-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
          {isSubmitting ? <><LoadingSpinner size="sm" /> Booking...</> : 'Book Session'}
        </button>
      </div>
    </form>
  )
}
