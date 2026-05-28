export const dynamic = 'force-dynamic'
import { ComplaintForm } from '@/components/forms/ComplaintForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewComplaintPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">File a New Complaint</h1>
        <p className="text-gray-500 text-sm mt-1">Submit your dispute for mediation. All fields marked * are required.</p>
      </div>
      <ComplaintForm />
    </div>
  )
}
