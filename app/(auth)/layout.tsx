export const dynamic = 'force-dynamic'
import { Scale } from 'lucide-react'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-green-900 py-4 px-6">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
            <Scale className="w-5 h-5 text-green-900" />
          </div>
          <span className="text-white font-bold text-sm">Lagos CMB</span>
        </Link>
      </header>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  )
}
