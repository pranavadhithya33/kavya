'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User, Phone, Mail, FileText } from 'lucide-react'
import Link from 'next/link'

interface Patient {
  patient_id: string
  patient: { name: string; phone: string; email: string }
}

export default function DoctorPatients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(';').shift()
    }
    const uid = getCookie('medconnect_user_id') || ''
    fetchPatients(uid)
  }, [])

  const fetchPatients = async (uid: string) => {
    const { data } = await supabase
      .from('appointments')
      .select('patient_id, patient:patient_id(name, phone, email)')
      .eq('doctor_id', uid)
    const unique = data ? Array.from(new Map(data.map((p: any) => [p.patient_id, p])).values()) : []
    setPatients(unique as Patient[])
    setLoading(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Patients</h1>
        <p className="text-gray-500 mt-1">Patients you have appointments with</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading patients...</div>
      ) : patients.length === 0 ? (
        <div className="card p-12 text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No patients found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((p: any, index: number) => (
            <div key={index} className="card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-medical-100 rounded-full flex items-center justify-center text-medical-700 font-bold text-lg">
                  {p.patient?.name?.charAt(0) || '?'}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{p.patient?.name}</h3>
                  <p className="text-sm text-gray-500">Patient</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {p.patient?.email || 'No email'}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {p.patient?.phone || 'No phone'}
                </div>
              </div>
              <Link href="/doctor/records" className="btn-secondary w-full mt-4 text-sm">
                <FileText className="w-4 h-4" />
                View Records
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
