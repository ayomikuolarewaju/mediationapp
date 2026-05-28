'use client'

import { Bell, Search } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export function Navbar({ title }: { title?: string }) {
  const { profile } = useAuth()

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="lg:block hidden">
          <h1 className="text-lg font-semibold text-gray-900">{title || 'Dashboard'}</h1>
        </div>
        <div className="lg:hidden w-8" /> {/* Spacer for mobile menu button */}

        <div className="flex items-center gap-4 ml-auto">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search cases..."
              className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
            />
          </div>
          <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-white text-sm font-semibold">
              {profile?.full_name?.charAt(0) || 'U'}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
