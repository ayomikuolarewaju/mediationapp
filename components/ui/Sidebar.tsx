'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, FileText, Calendar, Shield, User,
  LogOut, ChevronRight, Menu, X, Scale
} from 'lucide-react'
import { cn } from '@/lib/utils/helpers'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/complaints/my-complaints', icon: FileText, label: 'My Complaints' },
  { href: '/dashboard/appointments/my-appointments', icon: Calendar, label: 'Appointments' },
  { href: '/dashboard/enforcement/my-requests', icon: Shield, label: 'Enforcement' },
  { href: '/dashboard/profile', icon: User, label: 'My Profile' },
]

const adminNavItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Admin Dashboard' },
  { href: '/admin/complaints', icon: FileText, label: 'All Complaints' },
  { href: '/admin/appointments', icon: Calendar, label: 'All Appointments' },
  { href: '/admin/enforcement', icon: Shield, label: 'Enforcement' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { profile, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const items = profile?.role === 'admin' ? adminNavItems : navItems

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-green-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-yellow-400 rounded-lg flex items-center justify-center">
            <Scale className="w-5 h-5 text-green-900" />
          </div>
          <div>
            <p className="font-bold text-white text-sm leading-tight">Lagos CMB</p>
            <p className="text-green-300 text-xs">Citizens Mediation</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="px-6 py-4 border-b border-green-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold text-sm">
            {profile?.full_name?.charAt(0) || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{profile?.full_name || 'User'}</p>
            <p className="text-green-300 text-xs capitalize">{profile?.role || 'citizen'}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {items.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
                active
                  ? 'bg-yellow-400 text-green-900'
                  : 'text-green-200 hover:bg-green-800 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{label}</span>
              {active && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="px-4 pb-6">
        <button
          onClick={signOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-green-300 hover:bg-green-800 hover:text-white transition-all"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-green-800 text-white rounded-lg flex items-center justify-center shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside className={cn(
        'lg:hidden fixed left-0 top-0 h-full w-64 bg-green-900 z-40 transform transition-transform duration-300',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-green-900 h-screen sticky top-0 flex-shrink-0">
        <SidebarContent />
      </aside>
    </>
  )
}
