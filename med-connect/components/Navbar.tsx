'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { 
  Home, 
  Calendar, 
  FileText, 
  Users, 
  Stethoscope, 
  UserCircle, 
  LogOut, 
  LayoutDashboard,
  ClipboardList,
  Bell,
  Menu,
  X
} from 'lucide-react'
import { logout } from '@/lib/actions'
import NotificationBell from './NotificationBell'

export default function Navbar() {
  const pathname = usePathname()
  const [role, setRole] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(';').shift()
    }
    setRole(getCookie('medconnect_role') || '')
    setName(getCookie('medconnect_name') || '')
  }, [pathname])

  if (!role) return null

  const patientLinks = [
    { href: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/patient/appointments', label: 'Appointments', icon: Calendar },
    { href: '/patient/records', label: 'Medical Records', icon: FileText },
    { href: '/patient/profile', label: 'Profile', icon: UserCircle },
  ]

  const doctorLinks = [
    { href: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/doctor/appointments', label: 'Appointments', icon: Calendar },
    { href: '/doctor/patients', label: 'My Patients', icon: Users },
    { href: '/doctor/records', label: 'Medical Records', icon: FileText },
  ]

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/doctors', label: 'Doctors', icon: Stethoscope },
    { href: '/admin/patients', label: 'Patients', icon: Users },
    { href: '/admin/reports', label: 'Reports', icon: ClipboardList },
  ]

  const links = role === 'admin' ? adminLinks : role === 'doctor' ? doctorLinks : patientLinks

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href={links[0].href} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-medical-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MedConnect</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-medical-50 text-medical-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              )
            })}
            <div className="h-6 w-px bg-gray-200 mx-2" />
            <NotificationBell />
            <div className="flex items-center gap-3 ml-2">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-medium text-gray-900">{name}</p>
                <p className="text-xs text-gray-500 capitalize">{role}</p>
              </div>
              <form action={logout}>
                <button
                  type="submit"
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-2">
            <NotificationBell />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? 'bg-medical-50 text-medical-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              )
            })}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-gray-900">{name}</p>
                <p className="text-xs text-gray-500 capitalize">{role}</p>
              </div>
              <form action={logout}>
                <button
                  type="submit"
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
