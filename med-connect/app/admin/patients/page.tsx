'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { createPatient, updatePatient, deletePatient } from '@/lib/actions'
import { Users, Plus, X, Pencil, Trash2, AlertCircle, Mail, Phone } from 'lucide-react'

interface Patient {
  id: string
  age: number
  gender: string
  blood_group: string
  profile: { name: string; email: string; phone: string }
}

export default function AdminPatients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    const { data } = await supabase
      .from('patients')
      .select('*, profile:profile_id(name, email, phone)')
      .order('created_at', { ascending: false })
    
    const formattedPatients = (data || []).map((pat: any) => ({
      id: pat.id,
      age: pat.age,
      gender: pat.gender,
      blood_group: pat.blood_group,
      profile: Array.isArray(pat.profile) ? pat.profile[0] : pat.profile
    }))
    setPatients(formattedPatients)
    setLoading(false)
  }

  const handleCreate = async (formData: FormData) => {
    setError('')
    const result = await createPatient(formData)
    if (result?.error) setError(result.error)
    else { setShowForm(false); fetchPatients() }
  }

  const handleUpdate = async (formData: FormData) => {
    setError('')
    const result = await updatePatient(formData)
    if (result?.error) setError(result.error)
    else { setEditing(null); fetchPatients() }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this patient?')) return
    const formData = new FormData()
    formData.append('id', id)
    await deletePatient(formData)
    fetchPatients()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-500 mt-1">Manage registered patients</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Patient
        </button>
      </div>

      {(showForm || editing) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{editing ? 'Edit Patient' : 'Add Patient'}</h2>
              <button onClick={() => { setShowForm(false); setEditing(null) }} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <form action={editing ? handleUpdate : handleCreate} className="p-6 space-y-4">
              {editing && <input type="hidden" name="id" value={editing.id} />}
              <div>
                <label className="label">Full Name</label>
                <input name="name" required className="input" defaultValue={editing?.profile?.name || ''} />
              </div>
              <div>
                <label className="label">Email</label>
                <input name="email" type="email" required className="input" defaultValue={editing?.profile?.email || ''} disabled={!!editing} />
              </div>
              {!editing && (
                <div>
                  <label className="label">Password</label>
                  <input name="password" type="password" required className="input" />
                </div>
              )}
              <div>
                <label className="label">Phone</label>
                <input name="phone" className="input" defaultValue={editing?.profile?.phone || ''} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="label">Age</label>
                  <input name="age" type="number" className="input" defaultValue={editing?.age || ''} />
                </div>
                <div>
                  <label className="label">Gender</label>
                  <select name="gender" className="input" defaultValue={editing?.gender || ''}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="label">Blood Group</label>
                  <select name="blood_group" className="input" defaultValue={editing?.blood_group || ''}>
                    <option value="">Select</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
              {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</div>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setEditing(null) }} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">{editing ? 'Update' : 'Add'} Patient</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading patients...</div>
      ) : patients.length === 0 ? (
        <div className="card p-12 text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No patients found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((pat) => (
            <div key={pat.id} className="card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg">
                  {pat.profile?.name?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{pat.profile?.name}</h3>
                  <p className="text-sm text-gray-500">{pat.gender} • {pat.age} years • {pat.blood_group}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" />{pat.profile?.email}</div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" />{pat.profile?.phone || 'N/A'}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(pat)} className="btn-secondary flex-1 text-sm"><Pencil className="w-3 h-3" />Edit</button>
                <button onClick={() => handleDelete(pat.id)} className="btn-danger flex-1 text-sm"><Trash2 className="w-3 h-3" />Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
