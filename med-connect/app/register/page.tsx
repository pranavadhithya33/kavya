'use client'

import { useState } from 'react'
import Link from 'next/link'
import { register } from '@/lib/actions'
import { Stethoscope, ArrowLeft, User, Stethoscope as DoctorIcon } from 'lucide-react'

export default function RegisterPage() {
  const [role, setRole] = useState<'patient' | 'doctor'>('patient')
  const [error, setError] = useState('')

  const handleSubmit = async (formData: FormData) => {
    setError('')
    const result = await register(formData)
    if (result?.error) {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-medical-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-500 mt-1">Join MedConnect today</p>
          </div>

          <form action={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-3 mb-2">
              <button
                type="button"
                onClick={() => setRole('patient')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                  role === 'patient'
                    ? 'border-medical-600 bg-medical-50 text-medical-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <User className="w-4 h-4" />
                Patient
              </button>
              <button
                type="button"
                onClick={() => setRole('doctor')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                  role === 'doctor'
                    ? 'border-medical-600 bg-medical-50 text-medical-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <DoctorIcon className="w-4 h-4" />
                Doctor
              </button>
            </div>
            <input type="hidden" name="role" value={role} />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name</label>
                <input name="name" required className="input" placeholder="John Doe" />
              </div>
              <div>
                <label className="label">Email</label>
                <input name="email" type="email" required className="input" placeholder="you@example.com" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Password</label>
                <input name="password" type="password" required className="input" placeholder="Min 6 characters" />
              </div>
              <div>
                <label className="label">Phone</label>
                <input name="phone" type="tel" className="input" placeholder="+1 234 567 890" />
              </div>
            </div>

            <div>
              <label className="label">Address</label>
              <input name="address" className="input" placeholder="Your address" />
            </div>

            {role === 'doctor' && (
              <div className="grid grid-cols-2 gap-4 animate-fade-in">
                <div>
                  <label className="label">Specialization</label>
                  <input name="specialization" required className="input" placeholder="e.g. Cardiology" />
                </div>
                <div>
                  <label className="label">Experience</label>
                  <input name="experience" className="input" placeholder="e.g. 10 years" />
                </div>
              </div>
            )}

            {role === 'patient' && (
              <div className="grid grid-cols-3 gap-4 animate-fade-in">
                <div>
                  <label className="label">Age</label>
                  <input name="age" type="number" className="input" placeholder="25" />
                </div>
                <div>
                  <label className="label">Gender</label>
                  <select name="gender" className="input">
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="label">Blood Group</label>
                  <select name="blood_group" className="input">
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
            )}

            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full">
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Already have an account? </span>
            <Link href="/login" className="text-medical-600 font-medium hover:text-medical-700">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
