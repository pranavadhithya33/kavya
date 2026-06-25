import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  Calendar, 
  Users, 
  FileText, 
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function DoctorDashboard() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'doctor') redirect('/login')

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*, patient:patient_id(name)')
    .eq('doctor_id', user.id)
    .order('appointment_date', { ascending: false })
    .limit(5)

  const { data: patients } = await supabase
    .from('appointments')
    .select('patient_id, patient:patient_id(name, phone)')
    .eq('doctor_id', user.id)

  const uniquePatients = patients ? 
    Array.from(new Map(patients.map(p => [p.patient_id, p])).values()) : []

  const { data: records } = await supabase
    .from('medical_records')
    .select('*')
    .eq('doctor_id', user.id)

  const today = new Date().toISOString().split('T')[0]
  const todayAppointments = appointments?.filter(a => a.appointment_date === today) || []
  const pendingAppointments = appointments?.filter(a => a.status === 'pending') || []

  const stats = [
    { label: "Today's Appointments", value: todayAppointments.length, icon: Clock, color: 'bg-medical-50 text-medical-600' },
    { label: 'Pending Requests', value: pendingAppointments.length, icon: Calendar, color: 'bg-amber-50 text-amber-600' },
    { label: 'Total Patients', value: uniquePatients.length, icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Medical Records', value: records?.length || 0, icon: FileText, color: 'bg-purple-50 text-purple-600' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, Dr. {user.name}</h1>
        <p className="text-gray-500 mt-1">Manage your appointments and patients</p>
      </div>

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
        <div className="card">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-medical-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-medical-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Recent Appointments</h2>
                <p className="text-sm text-gray-500">Your appointment requests</p>
              </div>
            </div>
            <Link href="/doctor/appointments" className="text-sm text-medical-600 font-medium hover:text-medical-700 flex items-center gap-1">
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
                        <p className="text-sm font-medium text-gray-900">{apt.patient?.name}</p>
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
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">My Patients</h2>
                <p className="text-sm text-gray-500">Patients you've treated</p>
              </div>
            </div>
            <Link href="/doctor/patients" className="text-sm text-medical-600 font-medium hover:text-medical-700 flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-6">
            {uniquePatients.length > 0 ? (
              <div className="space-y-3">
                {uniquePatients.slice(0, 5).map((p: any, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-medical-100 rounded-full flex items-center justify-center text-medical-700 font-medium text-sm">
                      {p.patient?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{p.patient?.name}</p>
                      <p className="text-xs text-gray-500">{p.patient?.phone || 'No phone'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No patients yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        <Link href="/doctor/appointments" className="card p-6 hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-12 h-12 bg-medical-50 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-medical-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Manage Appointments</p>
            <p className="text-sm text-gray-500">Confirm or cancel requests</p>
          </div>
        </Link>
        <Link href="/doctor/records" className="card p-6 hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Medical Records</p>
            <p className="text-sm text-gray-500">Add patient diagnoses</p>
          </div>
        </Link>
        <Link href="/doctor/patients" className="card p-6 hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Patient List</p>
            <p className="text-sm text-gray-500">View all your patients</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
