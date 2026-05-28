'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const complaintTypes = [
  { value: 'family', label: 'Family Dispute (Marriage, Child Custody, Maintenance)' },
  { value: 'landlord_tenant', label: 'Landlord & Tenant (Eviction, Rent Arrears)' },
  { value: 'employment', label: 'Employment (Unfair Dismissal, Unpaid Salaries)' },
  { value: 'property', label: 'Property & Inheritance' },
  { value: 'financial', label: 'Financial Claims (Unpaid Debts, Contract Breach)' }
]

export default function NewComplaint() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    complaint_type: '',
    title: '',
    description: '',
    respondent_name: '',
    respondent_contact: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      alert('Please login first')
      return
    }

    const { data, error } = await supabase
      .from('complaints')
      .insert([{
        ...formData,
        user_id: user.id,
        status: 'pending'
      }])
      .select()
      .single()

    if (error) {
      alert('Error submitting complaint: ' + error.message)
    } else {
      router.push(`/complaints/${data.id}`)
    }
    
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-green-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">File a New Complaint</h1>
          <p className="text-green-100 mt-1">Free mediation services - Lagos State CMB</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type of Dispute *
            </label>
            <select
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.complaint_type}
              onChange={(e) => setFormData({...formData, complaint_type: e.target.value})}
            >
              <option value="">Select dispute type</option>
              {complaintTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Complaint Title *
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., Wrongful termination from employment"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description *
            </label>
            <textarea
              required
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Provide all relevant details, dates, and previous attempts at resolution..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Respondent Name *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.respondent_name}
                onChange={(e) => setFormData({...formData, respondent_name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Respondent Contact (Phone/Email)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.respondent_contact}
                onChange={(e) => setFormData({...formData, respondent_contact: e.target.value})}
              />
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-sm text-yellow-700">
              <strong>Confidential & Free:</strong> All mediations are confidential and provided at no cost. 
              The Citizens' Mediation Bureau is committed to amicable resolution.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition disabled:opacity-50 font-medium"
          >
            {loading ? 'Submitting...' : 'Submit Complaint for Mediation'}
          </button>
        </form>
      </div>
    </div>
  )
}