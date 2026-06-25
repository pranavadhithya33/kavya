'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { createAppointment, deleteAppointment } from '@/lib/actions'
import { 
  Calendar, 
  Plus, 
  X, 
  Clock, 
  Stethoscope, 
  AlertCircle,
  Trash2
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Doctor {
  id: string
  specialization: string
  profile: { name: string }
}

interface Appointment {
  id: string
  appointment_date: string
  appointment_time: string
  status: string
  reason: string
  doctor: { name: string }
}

export default function PatientAppointments() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [patientId, setPatientId] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(';').shift()
    }
    const uid = getCookie('medconnect_user_id') || ''
    setPatientId(uid)
    fetchData(uid)
  }, [])

  const fetchData = async (uid: string) => {
    const { data: doctorsData } = await supabase
      .from('doctors')
      .select('id, specialization, profile:profile_id(name)')
    setDoctors(doctorsData || [])

    const { data: aptData } = await supabase
      .from('appointments')
      .select('*, doctor:doctor_id(name)')
      .eq('patient_id', uid)
      .order('appointment_date', { ascending: false })
    setAppointments(aptData || [])
    setLoading(false)
  }

  const handleSubmit = async (formData: FormData) => {
    setError('')
    const result = await createAppointment(formData)
    if (result?.error) {
      setError(result.error)
    } else {
      setShowForm(false)
      fetchData(patientId)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return
    const formData = new FormData()
    formData.append('id', id)
    await deleteAppointment(formData)
    fetchData(patientId)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-500 mt-1">Manage your doctor appointments</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          Book Appointment
        </button>
      </div>

      {/* Booking Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Book Appointment</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form action={handleSubmit} className="p-6 space-y-4">
              <input type="hidden" name="patient_id" value={patientId} />

              <div>
                <label className="label">Select Doctor</label>
                <select name="doctor_id" required className="input">
                  <option value="">Choose a doctor</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.profile?.id || doc.id}>
                      Dr. {doc.profile?.name} - {doc.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Date</label>
                  <input name="appointment_date" type="date" required className="input" />
                </div>
                <div>
                  <label className="label">Time</label>
                  <input name="appointment_time" type="time" required className="input" />
                </div>
              </div>

              <div>
                <label className="label">Reason for Visit</label>
                <textarea name="reason" rows={3} className="input" placeholder="Describe your symptoms or reason..." />
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Book Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointments List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="card p-12 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments yet</h3>
          <p className="text-gray-500 mb-6">Book your first appointment with a doctor</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus className="w-4 h-4" />
            Book Appointment
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((apt) => (
            <div key={apt.id} className="card p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-medical-50 rounded-xl flex items-center justify-center shrink-0">
                    <Stethoscope className="w-6 h-6 text-medical-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900">Dr. {apt.doctor?.name}</h3>
                      <span className={`badge ${
                        apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        apt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
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
                      <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded-lg">{apt.reason}</p>
                    )}
                  </div>
                </div>
                {(apt.status === 'pending' || apt.status === 'confirmed') && (
                  <button
                    onClick={() => handleDelete(apt.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Cancel appointment"
                  >
                    <Trash2 className="w-4 h-4" />
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
