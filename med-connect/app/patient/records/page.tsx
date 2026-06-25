'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { FileText, Stethoscope, Pill, FlaskConical, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Record {
  id: string
  diagnosis: string
  treatment: string
  prescription: string
  test_results: string
  record_date: string
  doctor: { name: string }
}

export default function PatientRecords() {
  const [records, setRecords] = useState<Record[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null)

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(';').shift()
    }
    const uid = getCookie('medconnect_user_id') || ''
    fetchRecords(uid)
  }, [])

  const fetchRecords = async (uid: string) => {
    const { data } = await supabase
      .from('medical_records')
      .select('*, doctor:doctor_id(name)')
      .eq('patient_id', uid)
      .order('record_date', { ascending: false })
    setRecords(data || [])
    setLoading(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
        <p className="text-gray-500 mt-1">Your complete medical history and prescriptions</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading records...</div>
      ) : records.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No medical records yet</h3>
          <p className="text-gray-500">Your medical records will appear here after your first consultation</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {records.map((record) => (
            <div key={record.id} className="card p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedRecord(record)}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{record.diagnosis}</h3>
                      <span className="text-xs text-gray-400">{formatDate(record.record_date)}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">Dr. {record.doctor?.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {record.prescription && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                          <Pill className="w-3 h-3" />
                          Prescription available
                        </span>
                      )}
                      {record.test_results && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-md">
                          <FlaskConical className="w-3 h-3" />
                          Test results
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedRecord(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Medical Record Details</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-medical-50 rounded-lg">
                <Stethoscope className="w-5 h-5 text-medical-600" />
                <div>
                  <p className="text-xs text-gray-500">Doctor</p>
                  <p className="text-sm font-medium text-gray-900">Dr. {selectedRecord.doctor?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(selectedRecord.record_date)}</p>
                </div>
              </div>
              <div>
                <label className="label">Diagnosis</label>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedRecord.diagnosis}</p>
              </div>
              {selectedRecord.treatment && (
                <div>
                  <label className="label">Treatment</label>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedRecord.treatment}</p>
                </div>
              )}
              {selectedRecord.prescription && (
                <div>
                  <label className="label">Prescription</label>
                  <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">{selectedRecord.prescription}</p>
                </div>
              )}
              {selectedRecord.test_results && (
                <div>
                  <label className="label">Test Results</label>
                  <p className="text-sm text-gray-700 bg-amber-50 p-3 rounded-lg">{selectedRecord.test_results}</p>
                </div>
              )}
              <button onClick={() => setSelectedRecord(null)} className="btn-secondary w-full">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
