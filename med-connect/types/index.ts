export interface Profile {
  id: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
  role: 'patient' | 'doctor' | 'admin';
  created_at: string;
}

export interface Patient {
  id: string;
  profile_id: string;
  age?: number;
  gender?: string;
  blood_group?: string;
  medical_history?: string;
  allergies?: string;
  profile?: Profile;
}

export interface Doctor {
  id: string;
  profile_id: string;
  specialization: string;
  experience?: string;
  availability?: any[];
  consultation_fee?: number;
  profile?: Profile;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  reason?: string;
  notes?: string;
  created_at: string;
  patient?: Profile;
  doctor?: Profile;
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  doctor_id: string;
  diagnosis: string;
  treatment?: string;
  prescription?: string;
  test_results?: string;
  record_date: string;
  created_at: string;
  patient?: Profile;
  doctor?: Profile;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}
