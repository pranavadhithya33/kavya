import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, Stethoscope, Calendar, FileText, ChevronRight, TrendingUp } from 'lucide-react'

export default async function AdminDashboard() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'admin') redirect('/login')

  const { count: patientCount } = await supabase.from('patients').select('*', { count: 'exact', head: true })
  const { count: doctorCount } = await supabase.from('doctors').select('*', { count: 'exact', head: true })
  const { count: appointmentCount } = await supabase.from('appointments').select('*', { count: 'exact', head: true })
  const { count: recordCount } = await supabase.from('medical_records').select('*', { count: 'exact', head: true })

  const { data: recentAppointments } = await supabase
    .from('appointments')
    .select('*, patient:patient_id(name), doctor:doctor_id(name)')
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    { label: 'Total Patients', value: patientCount || 0, icon: Users, color: 'bg-blue-50 text-blue-600', href: '/admin/patients' },
    { label: 'Total Doctors', value: doctorCount || 0, icon: Stethoscope, color: 'bg-medical-50 text-medical-600', href: '/admin/doctors' },
    { label: 'Appointments', value: appointmentCount || 0, icon: Calendar, color: 'bg-amber-50 text-amber-600', href: '/admin/reports' },
    { label: 'Medical Records', value: recordCount || 0, icon: FileText, color: 'bg-purple-50 text-purple-600', href: '/admin/reports' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of MedConnect system</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Link key={index} href={stat.href} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              </div>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </Link>
          )
        })}
      </div>

      <div className="card">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <p className="text-sm text-gray-500">Latest appointments across the system</p>
            </div>
          </div>
          <Link href="/admin/reports" className="text-sm text-medical-600 font-medium hover:text-medical-700 flex items-center gap-1">
            View Reports <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="p-6">
          {recentAppointments && recentAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">Patient</th>
                    <th className="px-4 py-3">Doctor</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 rounded-r-lg">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAppointments.map((apt: any) => (
                    <tr key={apt.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{apt.patient?.name}</td>
                      <td className="px-4 py-3 text-gray-600">Dr. {apt.doctor?.name}</td>
                      <td className="px-4 py-3 text-gray-600">{apt.appointment_date}</td>
                      <td className="px-4 py-3">
                        <span className={`badge ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700' : apt.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{apt.appointment_time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No recent activity</div>
          )}
        </div>
      </div>
    </div>
  )
}
