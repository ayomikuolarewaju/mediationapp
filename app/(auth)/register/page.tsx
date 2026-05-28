'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { registerSchema, RegisterInput } from '@/lib/validations/schemas'
import { LGA_LIST } from '@/lib/utils/constants'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    setError('')
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.full_name, phone: data.phone, lga: data.lga, role: 'citizen' }
      }
    })

    if (signUpError) { setError(signUpError.message); return }

    if (authData.user) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: authData.user.id,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        lga: data.lga,
        address: data.address,
        role: 'citizen',
      })
      if (profileError) { setError(profileError.message); return }
    }

    router.push('/dashboard')
    router.refresh()
  }

  const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"

  return (
    <div className="w-full max-w-lg">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create Your Account</h1>
          <p className="text-gray-500 text-sm mt-1">Register to file complaints and access mediation services</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-6">{error}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <input {...register('full_name')} className={inputClass} placeholder="e.g. Adewale Johnson" />
            {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input {...register('email')} type="email" className={inputClass} placeholder="you@example.com" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
              <input {...register('phone')} className={inputClass} placeholder="08012345678" />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Local Government Area</label>
            <select {...register('lga')} className={inputClass}>
              <option value="">Select your LGA</option>
              {LGA_LIST.map(lga => <option key={lga} value={lga}>{lga}</option>)}
            </select>
            {errors.lga && <p className="text-red-500 text-xs mt-1">{errors.lga.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Home Address <span className="text-gray-400">(Optional)</span></label>
            <input {...register('address')} className={inputClass} placeholder="Your residential address" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <input {...register('password')} type={showPassword ? 'text' : 'password'} className={`${inputClass} pr-10`} placeholder="Min. 8 characters" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
            <input {...register('confirmPassword')} type="password" className={inputClass} placeholder="Re-enter your password" />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-700 text-white py-3 rounded-xl font-medium hover:bg-green-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting ? <><LoadingSpinner size="sm" /> Creating Account...</> : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-green-700 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
