import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  Calendar, 
  FileText, 
  Bell, 
  Clock, 
  ChevronRight,
  Activity,
  Heart
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function PatientDashboard() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'patient') redirect('/login')

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*, doctor:doctor_id(name)')
    .eq('patient_id', user.id)
    .order('appointment_date', { ascending: false })
    .limit(5)

  const { data: records } = await supabase
    .from('medical_records')
    .select('*, doctor:doctor_id(name)')
    .eq('patient_id', user.id)
    .order('created_at', { ascending: false })
    .limit(3)

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_read', false)

  const upcomingAppointments = appointments?.filter(
    (a) => a.status === 'confirmed' || a.status === 'pending'
  ) || []

  const stats = [
    { label: 'Total Appointments', value: appointments?.length || 0, icon: Calendar, color: 'bg-blue-50 text-blue-600' },
    { label: 'Upcoming', value: upcomingAppointments.length, icon: Clock, color: 'bg-medical-50 text-medical-600' },
    { label: 'Medical Records', value: records?.length || 0, icon: FileText, color: 'bg-purple-50 text-purple-600' },
    { label: 'Notifications', value: notifications?.length || 0, icon: Bell, color: 'bg-amber-50 text-amber-600' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}</h1>
        <p className="text-gray-500 mt-1">Here&apos;s your health overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              </div>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upcoming Appointments */}
        <div className="card">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-medical-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-medical-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Appointments</h2>
                <p className="text-sm text-gray-500">Your recent bookings</p>
              </div>
            </div>
            <Link href="/patient/appointments" className="text-sm text-medical-600 font-medium hover:text-medical-700 flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-6">
            {appointments && appointments.length > 0 ? (
              <div className="space-y-3">
                {appointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        apt.status === 'confirmed' ? 'bg-green-500' :
                        apt.status === 'pending' ? 'bg-amber-500' :
                        apt.status === 'cancelled' ? 'bg-red-500' : 'bg-gray-500'
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Dr. {apt.doctor?.name}</p>
                        <p className="text-xs text-gray-500">{formatDate(apt.appointment_date)} at {apt.appointment_time}</p>
                      </div>
                    </div>
                    <span className={`badge ${
                      apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      apt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No appointments yet</p>
                <Link href="/patient/appointments" className="text-medical-600 text-sm font-medium mt-2 inline-block">
                  Book your first appointment
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Medical Records Preview */}
        <div className="card">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Medical Records</h2>
                <p className="text-sm text-gray-500">Recent diagnoses & prescriptions</p>
              </div>
            </div>
            <Link href="/patient/records" className="text-sm text-medical-600 font-medium hover:text-medical-700 flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-6">
            {records && records.length > 0 ? (
              <div className="space-y-3">
                {records.map((record) => (
                  <div key={record.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">{record.diagnosis}</p>
                      <span className="text-xs text-gray-400">{formatDate(record.record_date)}</span>
                    </div>
                    <p className="text-xs text-gray-500">Dr. {record.doctor?.name}</p>
                    {record.prescription && (
                      <p className="text-xs text-gray-600 mt-1">💊 {record.prescription}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No medical records yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        <Link href="/patient/appointments" className="card p-6 hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-12 h-12 bg-medical-50 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-medical-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Book Appointment</p>
            <p className="text-sm text-gray-500">Schedule with a doctor</p>
          </div>
        </Link>
        <Link href="/patient/records" className="card p-6 hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">View Records</p>
            <p className="text-sm text-gray-500">Check your medical history</p>
          </div>
        </Link>
        <Link href="/patient/profile" className="card p-6 hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-pink-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">My Profile</p>
            <p className="text-sm text-gray-500">Update your information</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
