'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'

export default function EnforcementRequest() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    enforcement_reason: '',
    mediation_summary: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    
    const { error } = await supabase
      .from('enforcement_requests')
      .insert([{
        complaint_id: params.complaintId,
        user_id: user!.id,
        ...formData,
        status: 'submitted'
      }])

    if (error) {
      alert('Error submitting enforcement request: ' + error.message)
    } else {
      router.push('/enforcement/status')
    }
    
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="border-b border-red-200 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-red-600">Enforcement Request</h1>
          <p className="text-gray-600">Since mediation failed, request legal enforcement</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Why did mediation fail? *
            </label>
            <textarea
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Explain why the other party didn't comply with mediation agreement..."
              value={formData.enforcement_reason}
              onChange={(e) => setFormData({...formData, enforcement_reason: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Summary of Mediation Outcome
            </label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Brief summary of what was agreed during mediation..."
              value={formData.mediation_summary}
              onChange={(e) => setFormData({...formData, mediation_summary: e.target.value})}
            />
          </div>

          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-800">
              <strong>Important:</strong> Enforcement requests are reviewed by CMB officers within 5-7 business days. 
              If approved, your case will be escalated to the appropriate legal channels.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700"
          >
            {loading ? 'Submitting...' : 'Request Enforcement'}
          </button>
        </form>
      </div>
    </div>
  )
}