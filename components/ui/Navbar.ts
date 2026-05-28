'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export function Navbar() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => listener?.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="bg-green-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">⚖️</span>
              <span className="font-bold text-xl">Lagos CMB</span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-8">
              <Link href="/dashboard" className="hover:text-green-200 transition">Dashboard</Link>
              <Link href="/complaints/new" className="hover:text-green-200 transition">New Complaint</Link>
              <Link href="/appointments/my-appointments" className="hover:text-green-200 transition">Appointments</Link>
              <Link href="/enforcement/my-requests" className="hover:text-green-200 transition">Enforcement</Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="bg-green-600 hover:bg-green-800 px-4 py-2 rounded-md text-sm transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}