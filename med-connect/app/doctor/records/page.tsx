'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { createMedicalRecord, updateMedicalRecord, deleteMedicalRecord } from '@/lib/actions'
import { FileText, Plus, X, Pencil, Trash2, AlertCircle, User } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Record {
  id: string
  patient_id: string
  diagnosis: string
  treatment: string
  prescription: string
  test_results: string
  record_date: string
  patient: { name: string }
}

export default function DoctorRecords() {
  const [records, setRecords] = useState<Record[]>([])
  const [patients, setPatients] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Record | null>(null)
  const [loading, setLoading] = useState(true)
  const [doctorId, setDoctorId] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(';').shift()
    }
    const uid = getCookie('medconnect_user_id') || ''
    setDoctorId(uid)
    fetchData(uid)
  }, [])

  const fetchData = async (uid: string) => {
    const { data: r } = await supabase
      .from('medical_records')
      .select('*, patient:patient_id(name)')
      .eq('doctor_id', uid)
      .order('record_date', { ascending: false })
    
    const formattedRecords = (r || []).map((rec: any) => ({
      id: rec.id,
      patient_id: rec.patient_id,
      diagnosis: rec.diagnosis,
      treatment: rec.treatment,
      prescription: rec.prescription,
      test_results: rec.test_results,
      record_date: rec.record_date,
      patient: Array.isArray(rec.patient) ? rec.patient[0] : rec.patient
    }))
    setRecords(formattedRecords)

    const { data: apt } = await supabase
      .from('appointments')
      .select('patient_id, patient:patient_id(name)')
      .eq('doctor_id', uid)
    
    const formattedApt = (apt || []).map((p: any) => ({
      patient_id: p.patient_id,
      patient: Array.isArray(p.patient) ? p.patient[0] : p.patient
    }))
    const unique = formattedApt ? Array.from(new Map(formattedApt.map((p: any) => [p.patient_id, p])).values()) : []
    setPatients(unique)
    setLoading(false)
  }

  const handleCreate = async (formData: FormData) => {
    setError('')
    const result = await createMedicalRecord(formData)
    if (result?.error) setError(result.error)
    else {
      setShowForm(false)
      fetchData(doctorId)
    }
  }

  const handleUpdate = async (formData: FormData) => {
    setError('')
    const result = await updateMedicalRecord(formData)
    if (result?.error) setError(result.error)
    else {
      setEditing(null)
      fetchData(doctorId)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this record?')) return
    const formData = new FormData()
    formData.append('id', id)
    await deleteMedicalRecord(formData)
    fetchData(doctorId)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
          <p className="text-gray-500 mt-1">Manage patient diagnoses and prescriptions</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Record
        </button>
      </div>

      {(showForm || editing) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {editing ? 'Edit Record' : 'New Medical Record'}
              </h2>
              <button onClick={() => { setShowForm(false); setEditing(null) }} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form action={editing ? handleUpdate : handleCreate} className="p-6 space-y-4">
              <input type="hidden" name="doctor_id" value={doctorId} />
              {editing && <input type="hidden" name="id" value={editing.id} />}

              <div>
                <label className="label">Patient</label>
                <select name="patient_id" required className="input" defaultValue={editing?.patient_id || ''}>
                  <option value="">Select patient</option>
                  {patients.map((p: any) => (
                    <option key={p.patient_id} value={p.patient_id}>{p.patient?.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Diagnosis</label>
                <input name="diagnosis" required className="input" defaultValue={editing?.diagnosis || ''} placeholder="Primary diagnosis" />
              </div>

              <div>
                <label className="label">Treatment</label>
                <textarea name="treatment" rows={2} className="input" defaultValue={editing?.treatment || ''} placeholder="Treatment plan" />
              </div>

              <div>
                <label className="label">Prescription</label>
                <textarea name="prescription" rows={2} className="input" defaultValue={editing?.prescription || ''} placeholder="Medications and dosage" />
              </div>

              <div>
                <label className="label">Test Results</label>
                <textarea name="test_results" rows={2} className="input" defaultValue={editing?.test_results || ''} placeholder="Lab test results" />
              </div>

              {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</div>}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setEditing(null) }} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">{editing ? 'Update' : 'Save'} Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading records...</div>
      ) : records.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No medical records yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <div key={record.id} className="card p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900">{record.diagnosis}</h3>
                      <span className="text-xs text-gray-400">{formatDate(record.record_date)}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                      <User className="w-3 h-3" /> {record.patient?.name}
                    </p>
                    {record.treatment && <p className="text-sm text-gray-600 mb-1">Treatment: {record.treatment}</p>}
                    {record.prescription && <p className="text-sm text-blue-600 mb-1">Prescription: {record.prescription}</p>}
                    {record.test_results && <p className="text-sm text-amber-600">Tests: {record.test_results}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setEditing(record)} className="p-2 text-gray-400 hover:text-medical-600 hover:bg-medical-50 rounded-lg">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(record.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
