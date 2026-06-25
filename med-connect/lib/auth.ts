import { cookies } from 'next/headers'
import { supabase } from './supabase'

export async function getCurrentUser() {
  const cookieStore = cookies()
  const userId = cookieStore.get('medconnect_user_id')?.value
  const role = cookieStore.get('medconnect_role')?.value

  if (!userId || !role) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (!profile) return null

  return { ...profile, role: profile.role as 'patient' | 'doctor' | 'admin' }
}

export async function requireAuth(allowedRoles?: string[]) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw new Error('Forbidden')
  }
  return user
}

export async function logout() {
  'use server'
  const cookieStore = cookies()
  cookieStore.delete('medconnect_user_id')
  cookieStore.delete('medconnect_role')
  cookieStore.delete('medconnect_name')
}
