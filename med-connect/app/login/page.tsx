'use client'

import { useState } from 'react'
import Link from 'next/link'
import { login } from '@/lib/actions'
import { Stethoscope, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const [error, setError] = useState('')

  const handleSubmit = async (formData: FormData) => {
    setError('')
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
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
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-gray-500 mt-1">Sign in to your MedConnect account</p>
          </div>

          <form action={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">
                {error}
              </div>
            )}
            <div>
              <label className="label">Email</label>
              <input
                name="email"
                type="email"
                required
                className="input"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                name="password"
                type="password"
                required
                className="input"
                placeholder="Enter your password"
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Don&apos;t have an account? </span>
            <Link href="/register" className="text-medical-600 font-medium hover:text-medical-700">
              Create one
            </Link>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-xs text-gray-500">
            <p className="font-medium text-gray-700 mb-2">Demo Credentials:</p>
            <p>Admin: admin@medconnect.com / admin123</p>
            <p>Doctor: doctor@medconnect.com / doctor123</p>
            <p>Patient: patient@medconnect.com / patient123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
