'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { updateProfile } from '@/lib/actions'
import { UserCircle, Mail, Phone, MapPin, Save, AlertCircle } from 'lucide-react'

interface PatientProfile {
  id: string
  name: string
  email: string
  phone: string
  address: string
  age: number
  gender: string
  blood_group: string
  medical_history: string
  allergies: string
}

export default function PatientProfilePage() {
  const [profile, setProfile] = useState<PatientProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(';').shift()
    }
    const uid = getCookie('medconnect_user_id') || ''
    fetchProfile(uid)
  }, [])

  const fetchProfile = async (uid: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*, patients(*)')
      .eq('id', uid)
      .single()
    if (data) {
      setProfile({
        id: data.id,
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        age: data.patients?.[0]?.age || '',
        gender: data.patients?.[0]?.gender || '',
        blood_group: data.patients?.[0]?.blood_group || '',
        medical_history: data.patients?.[0]?.medical_history || '',
        allergies: data.patients?.[0]?.allergies || '',
      })
    }
    setLoading(false)
  }

  const handleSubmit = async (formData: FormData) => {
    setSaving(true)
    setError('')
    setMessage('')
    const result = await updateProfile(formData)
    if (result?.error) {
      setError(result.error)
    } else {
      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    }
    setSaving(false)
  }

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8 text-gray-500">Loading profile...</div>
  if (!profile) return <div className="max-w-7xl mx-auto px-4 py-8 text-red-500">Profile not found</div>

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your personal information</p>
      </div>

      <div className="card">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-medical-100 rounded-full flex items-center justify-center">
              <UserCircle className="w-8 h-8 text-medical-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{profile.name}</h2>
              <p className="text-sm text-gray-500 capitalize">Patient</p>
            </div>
          </div>
        </div>

        <form action={handleSubmit} className="p-6 space-y-6">
          <input type="hidden" name="id" value={profile.id} />

          {message && (
            <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg flex items-center gap-2">
              <Save className="w-4 h-4" />
              {message}
            </div>
          )}
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input name="name" defaultValue={profile.name} className="input pl-9" required />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input type="email" defaultValue={profile.email} className="input pl-9 bg-gray-50" disabled />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input name="phone" defaultValue={profile.phone} className="input pl-9" />
              </div>
            </div>
            <div>
              <label className="label">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input name="address" defaultValue={profile.address} className="input pl-9" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="label">Age</label>
              <input type="number" defaultValue={profile.age} className="input bg-gray-50" disabled />
            </div>
            <div>
              <label className="label">Gender</label>
              <input defaultValue={profile.gender} className="input bg-gray-50" disabled />
            </div>
            <div>
              <label className="label">Blood Group</label>
              <input defaultValue={profile.blood_group} className="input bg-gray-50" disabled />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Medical History</label>
              <textarea defaultValue={profile.medical_history} rows={3} className="input bg-gray-50" disabled />
            </div>
            <div>
              <label className="label">Allergies</label>
              <textarea defaultValue={profile.allergies} rows={3} className="input bg-gray-50" disabled />
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" disabled={saving} className="btn-primary">
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
