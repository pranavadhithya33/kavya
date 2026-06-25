'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { createDoctor, updateDoctor, deleteDoctor } from '@/lib/actions'
import { Stethoscope, Plus, X, Pencil, Trash2, AlertCircle, Mail, Phone } from 'lucide-react'

interface Doctor {
  id: string
  specialization: string
  experience: string
  profile: { name: string; email: string; phone: string }
}

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    const { data } = await supabase
      .from('doctors')
      .select('*, profile:profile_id(name, email, phone)')
      .order('created_at', { ascending: false })
    
    const formattedDoctors = (data || []).map((doc: any) => ({
      id: doc.id,
      specialization: doc.specialization,
      experience: doc.experience,
      profile: Array.isArray(doc.profile) ? doc.profile[0] : doc.profile
    }))
    setDoctors(formattedDoctors)
    setLoading(false)
  }

  const handleCreate = async (formData: FormData) => {
    setError('')
    const result = await createDoctor(formData)
    if (result?.error) setError(result.error)
    else { setShowForm(false); fetchDoctors() }
  }

  const handleUpdate = async (formData: FormData) => {
    setError('')
    const result = await updateDoctor(formData)
    if (result?.error) setError(result.error)
    else { setEditing(null); fetchDoctors() }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this doctor?')) return
    const formData = new FormData()
    formData.append('id', id)
    await deleteDoctor(formData)
    fetchDoctors()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctors</h1>
          <p className="text-gray-500 mt-1">Manage healthcare providers</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Doctor
        </button>
      </div>

      {(showForm || editing) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{editing ? 'Edit Doctor' : 'Add Doctor'}</h2>
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
              <div>
                <label className="label">Specialization</label>
                <input name="specialization" required className="input" defaultValue={editing?.specialization || ''} />
              </div>
              <div>
                <label className="label">Experience</label>
                <input name="experience" className="input" defaultValue={editing?.experience || ''} placeholder="e.g. 10 years" />
              </div>
              {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</div>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setEditing(null) }} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">{editing ? 'Update' : 'Add'} Doctor</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading doctors...</div>
      ) : doctors.length === 0 ? (
        <div className="card p-12 text-center">
          <Stethoscope className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No doctors found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doc) => (
            <div key={doc.id} className="card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-medical-100 rounded-full flex items-center justify-center text-medical-700 font-bold text-lg">
                  {doc.profile?.name?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{doc.profile?.name}</h3>
                  <p className="text-sm text-medical-600">{doc.specialization}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" />{doc.profile?.email}</div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" />{doc.profile?.phone || 'N/A'}</div>
                <div className="flex items-center gap-2"><Stethoscope className="w-4 h-4 text-gray-400" />{doc.experience || 'N/A'} experience</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(doc)} className="btn-secondary flex-1 text-sm"><Pencil className="w-3 h-3" />Edit</button>
                <button onClick={() => handleDelete(doc.id)} className="btn-danger flex-1 text-sm"><Trash2 className="w-3 h-3" />Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
