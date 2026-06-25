'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { supabase } from './supabase'
import { redirect } from 'next/navigation'

// Auth Actions
export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .eq('password', password)
    .single()

  if (error || !profile) {
    return { error: 'Invalid email or password' }
  }

  const cookieStore = cookies()
  cookieStore.set('medconnect_user_id', profile.id, { maxAge: 60 * 60 * 24 * 7 })
  cookieStore.set('medconnect_role', profile.role, { maxAge: 60 * 60 * 24 * 7 })
  cookieStore.set('medconnect_name', profile.name, { maxAge: 60 * 60 * 24 * 7 })

  if (profile.role === 'admin') redirect('/admin/dashboard')
  if (profile.role === 'doctor') redirect('/doctor/dashboard')
  redirect('/patient/dashboard')
}

export async function logout() {
  const cookieStore = cookies()
  cookieStore.delete('medconnect_user_id')
  cookieStore.delete('medconnect_role')
  cookieStore.delete('medconnect_name')
  redirect('/login')
}

export async function register(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string
  const role = formData.get('role') as string
  const specialization = formData.get('specialization') as string
  const experience = formData.get('experience') as string
  const age = formData.get('age') as string
  const gender = formData.get('gender') as string
  const blood_group = formData.get('blood_group') as string

  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single()

  if (existing) {
    return { error: 'Email already registered' }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .insert({ email, password, name, phone, address, role })
    .select()
    .single()

  if (profileError || !profile) {
    return { error: 'Registration failed' }
  }

  if (role === 'doctor') {
    await supabase.from('doctors').insert({
      profile_id: profile.id,
      specialization,
      experience,
      availability: [],
    })
  } else if (role === 'patient') {
    await supabase.from('patients').insert({
      profile_id: profile.id,
      age: age ? parseInt(age) : null,
      gender,
      blood_group,
    })
  }

  const cookieStore = cookies()
  cookieStore.set('medconnect_user_id', profile.id, { maxAge: 60 * 60 * 24 * 7 })
  cookieStore.set('medconnect_role', profile.role, { maxAge: 60 * 60 * 24 * 7 })
  cookieStore.set('medconnect_name', profile.name, { maxAge: 60 * 60 * 24 * 7 })

  if (role === 'admin') redirect('/admin/dashboard')
  if (role === 'doctor') redirect('/doctor/dashboard')
  redirect('/patient/dashboard')
}

// Appointment Actions
export async function createAppointment(formData: FormData) {
  const patient_id = formData.get('patient_id') as string
  const doctor_id = formData.get('doctor_id') as string
  const appointment_date = formData.get('appointment_date') as string
  const appointment_time = formData.get('appointment_time') as string
  const reason = formData.get('reason') as string

  const { data, error } = await supabase
    .from('appointments')
    .insert({ patient_id, doctor_id, appointment_date, appointment_time, reason, status: 'pending' })
    .select()
    .single()

  if (error) return { error: error.message }

  // Create notification for doctor
  await supabase.from('notifications').insert({
    user_id: doctor_id,
    title: 'New Appointment Request',
    message: `You have a new appointment request for ${appointment_date} at ${appointment_time}`,
    type: 'appointment',
  })

  revalidatePath('/patient/appointments')
  revalidatePath('/doctor/appointments')
  return { success: true, data }
}

export async function updateAppointmentStatus(formData: FormData) {
  const id = formData.get('id') as string
  const status = formData.get('status') as string
  const patient_id = formData.get('patient_id') as string

  const { error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id)

  if (error) return { error: error.message }

  const statusMessages: Record<string, string> = {
    confirmed: 'Your appointment has been confirmed',
    cancelled: 'Your appointment has been cancelled',
    completed: 'Your appointment has been marked as completed',
  }

  if (statusMessages[status]) {
    await supabase.from('notifications').insert({
      user_id: patient_id,
      title: 'Appointment Update',
      message: statusMessages[status],
      type: 'appointment',
    })
  }

  revalidatePath('/doctor/appointments')
  revalidatePath('/patient/appointments')
  return { success: true }
}

export async function deleteAppointment(formData: FormData) {
  const id = formData.get('id') as string

  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/patient/appointments')
  revalidatePath('/doctor/appointments')
  return { success: true }
}

// Medical Record Actions
export async function createMedicalRecord(formData: FormData) {
  const patient_id = formData.get('patient_id') as string
  const doctor_id = formData.get('doctor_id') as string
  const diagnosis = formData.get('diagnosis') as string
  const treatment = formData.get('treatment') as string
  const prescription = formData.get('prescription') as string
  const test_results = formData.get('test_results') as string

  const { data, error } = await supabase
    .from('medical_records')
    .insert({ patient_id, doctor_id, diagnosis, treatment, prescription, test_results })
    .select()
    .single()

  if (error) return { error: error.message }

  await supabase.from('notifications').insert({
    user_id: patient_id,
    title: 'New Medical Record',
    message: 'A new medical record has been added to your profile',
    type: 'record',
  })

  revalidatePath('/doctor/records')
  revalidatePath('/patient/records')
  return { success: true, data }
}

export async function updateMedicalRecord(formData: FormData) {
  const id = formData.get('id') as string
  const diagnosis = formData.get('diagnosis') as string
  const treatment = formData.get('treatment') as string
  const prescription = formData.get('prescription') as string
  const test_results = formData.get('test_results') as string

  const { error } = await supabase
    .from('medical_records')
    .update({ diagnosis, treatment, prescription, test_results })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/doctor/records')
  revalidatePath('/patient/records')
  return { success: true }
}

export async function deleteMedicalRecord(formData: FormData) {
  const id = formData.get('id') as string

  const { error } = await supabase
    .from('medical_records')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/doctor/records')
  revalidatePath('/patient/records')
  return { success: true }
}

// Doctor Management Actions
export async function createDoctor(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const specialization = formData.get('specialization') as string
  const experience = formData.get('experience') as string

  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single()

  if (existing) return { error: 'Email already exists' }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .insert({ email, password, name, phone, role: 'doctor' })
    .select()
    .single()

  if (profileError || !profile) return { error: 'Failed to create doctor' }

  await supabase.from('doctors').insert({
    profile_id: profile.id,
    specialization,
    experience,
  })

  revalidatePath('/admin/doctors')
  return { success: true }
}

export async function updateDoctor(formData: FormData) {
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const specialization = formData.get('specialization') as string
  const experience = formData.get('experience') as string

  const { data: doctor } = await supabase
    .from('doctors')
    .select('profile_id')
    .eq('id', id)
    .single()

  if (!doctor) return { error: 'Doctor not found' }

  await supabase.from('profiles').update({ name, phone }).eq('id', doctor.profile_id)
  await supabase.from('doctors').update({ specialization, experience }).eq('id', id)

  revalidatePath('/admin/doctors')
  return { success: true }
}

export async function deleteDoctor(formData: FormData) {
  const id = formData.get('id') as string

  const { data: doctor } = await supabase
    .from('doctors')
    .select('profile_id')
    .eq('id', id)
    .single()

  if (doctor?.profile_id) {
    await supabase.from('profiles').delete().eq('id', doctor.profile_id)
  }

  revalidatePath('/admin/doctors')
  return { success: true }
}

// Patient Management Actions
export async function createPatient(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const age = formData.get('age') as string
  const gender = formData.get('gender') as string
  const blood_group = formData.get('blood_group') as string

  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single()

  if (existing) return { error: 'Email already exists' }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .insert({ email, password, name, phone, role: 'patient' })
    .select()
    .single()

  if (profileError || !profile) return { error: 'Failed to create patient' }

  await supabase.from('patients').insert({
    profile_id: profile.id,
    age: age ? parseInt(age) : null,
    gender,
    blood_group,
  })

  revalidatePath('/admin/patients')
  return { success: true }
}

export async function updatePatient(formData: FormData) {
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const age = formData.get('age') as string
  const gender = formData.get('gender') as string
  const blood_group = formData.get('blood_group') as string

  const { data: patient } = await supabase
    .from('patients')
    .select('profile_id')
    .eq('id', id)
    .single()

  if (!patient) return { error: 'Patient not found' }

  await supabase.from('profiles').update({ name, phone }).eq('id', patient.profile_id)
  await supabase.from('patients').update({ age: age ? parseInt(age) : null, gender, blood_group }).eq('id', id)

  revalidatePath('/admin/patients')
  return { success: true }
}

export async function deletePatient(formData: FormData) {
  const id = formData.get('id') as string

  const { data: patient } = await supabase
    .from('patients')
    .select('profile_id')
    .eq('id', id)
    .single()

  if (patient?.profile_id) {
    await supabase.from('profiles').delete().eq('id', patient.profile_id)
  }

  revalidatePath('/admin/patients')
  return { success: true }
}

// Notification Actions
export async function markNotificationRead(formData: FormData) {
  const id = formData.get('id') as string

  await supabase.from('notifications').update({ is_read: true }).eq('id', id)
  revalidatePath('/')
  return { success: true }
}

export async function markAllNotificationsRead(userId: string) {
  await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId)
  revalidatePath('/')
  return { success: true }
}

// Profile Update
export async function updateProfile(formData: FormData) {
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string

  const { error } = await supabase.from('profiles').update({ name, phone, address }).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/patient/profile')
  revalidatePath('/doctor/dashboard')
  return { success: true }
}
