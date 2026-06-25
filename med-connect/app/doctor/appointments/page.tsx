'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { updateAppointmentStatus } from '@/lib/actions'
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Filter
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Appointment {
  id: string
  patient_id: string
  appointment_date: string
  appointment_time: string
  status: string
  reason: string
  patient: { name: string }
}

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [doctorId, setDoctorId] = useState('')

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(';').shift()
    }
    const uid = getCookie('medconnect_user_id') || ''
    setDoctorId(uid)
    fetchAppointments(uid)
  }, [])

  const fetchAppointments = async (uid: string) => {
    const { data } = await supabase
      .from('appointments')
      .select('*, patient:patient_id(name)')
      .eq('doctor_id', uid)
      .order('appointment_date', { ascending: false })
    setAppointments(data || [])
    setLoading(false)
  }

  const handleStatusUpdate = async (id: string, patientId: string, status: string) => {
    const formData = new FormData()
    formData.append('id', id)
    formData.append('patient_id', patientId)
    formData.append('status', status)
    await updateAppointmentStatus(formData)
    fetchAppointments(doctorId)
  }

  const filtered = filter === 'all' 
    ? appointments 
    : appointments.filter(a => a.status === filter)

  const filters = [
    { value: 'all', label: 'All', count: appointments.length },
    { value: 'pending', label: 'Pending', count: appointments.filter(a => a.status === 'pending').length },
    { value: 'confirmed', label: 'Confirmed', count: appointments.filter(a => a.status === 'confirmed').length },
    { value: 'completed', label: 'Completed', count: appointments.filter(a => a.status === 'completed').length },
    { value: 'cancelled', label: 'Cancelled', count: appointments.filter(a => a.status === 'cancelled').length },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        <p className="text-gray-500 mt-1">Manage patient appointment requests</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-medical-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              filter === f.value ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
            }`}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading appointments...</div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
          <p className="text-gray-500">No {filter !== 'all' ? filter : ''} appointments to display</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((apt) => (
            <div key={apt.id} className="card p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-medical-50 rounded-xl flex items-center justify-center shrink-0">
                    <User className="w-6 h-6 text-medical-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900">{apt.patient?.name}</h3>
                      <span className={`badge ${
                        apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        apt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(apt.appointment_date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {apt.appointment_time}
                      </span>
                    </div>
                    {apt.reason && (
                      <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded-lg inline-block">{apt.reason}</p>
                    )}
                  </div>
                </div>

                {apt.status === 'pending' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStatusUpdate(apt.id, apt.patient_id, 'confirmed')}
                      className="btn-primary text-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Confirm
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(apt.id, apt.patient_id, 'cancelled')}
                      className="btn-danger text-sm"
                    >
                      <XCircle className="w-4 h-4" />
                      Decline
                    </button>
                  </div>
                )}

                {apt.status === 'confirmed' && (
                  <button
                    onClick={() => handleStatusUpdate(apt.id, apt.patient_id, 'completed')}
                    className="btn-secondary text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Mark Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
