'use client'
export const dynamic = 'force-dynamic'


import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { User, Mail, Phone, MapPin, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { profileSchema, ProfileInput } from '@/lib/validations/schemas'
import { LGA_LIST } from '@/lib/utils/constants'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useToast } from '@/components/shared/Toast'

export default function ProfilePage() {
  const { profile, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const supabase = createClient()
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    if (profile) {
      reset({ full_name: profile.full_name, phone: profile.phone, address: profile.address, lga: profile.lga })
    }
  }, [profile])

  const onSubmit = async (data: ProfileInput) => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('profiles').update({ ...data, updated_at: new Date().toISOString() }).eq('id', user.id)
    setSaving(false)
    if (error) { toast(error.message, 'error'); return }
    toast('Profile updated successfully!', 'success')
  }

  if (authLoading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>

  const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account information</p>
      </div>

      {/* Avatar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-green-700 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
          {profile?.full_name?.charAt(0) || 'U'}
        </div>
        <div>
          <h2 className="font-bold text-gray-900 text-xl">{profile?.full_name}</h2>
          <p className="text-gray-500 text-sm">{profile?.email}</p>
          <div className="flex items-center gap-1.5 mt-2">
            <Shield className="w-3.5 h-3.5 text-green-600" />
            <span className="text-xs text-green-700 font-medium capitalize">{profile?.role} Account</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
        <h3 className="font-semibold text-gray-900">Personal Information</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
          <input {...register('full_name')} className={inputClass} />
          {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
          <input value={profile?.email || ''} disabled className={`${inputClass} bg-gray-50 text-gray-500 cursor-not-allowed`} />
          <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
          <input {...register('phone')} className={inputClass} placeholder="08012345678" />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Local Government Area</label>
          <select {...register('lga')} className={inputClass}>
            <option value="">Select your LGA</option>
            {LGA_LIST.map(lga => <option key={lga} value={lga}>{lga}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Home Address</label>
          <input {...register('address')} className={inputClass} placeholder="Your residential address" />
        </div>

        <button type="submit" disabled={saving}
          className="w-full bg-green-700 text-white py-3 rounded-xl font-medium hover:bg-green-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
          {saving ? <><LoadingSpinner size="sm" /> Saving...</> : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
