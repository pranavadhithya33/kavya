MedConnect
Smart Healthcare and Appointment Management System built with Next.js 14 + Supabase.

Setup
Create a free Supabase project at https://supabase.com
Open the SQL Editor in your Supabase dashboard
Copy the contents of supabase-schema.sql and run it
Copy .env.local to .env.local and fill in your Supabase credentials:
NEXT_PUBLIC_SUPABASE_URL - from Supabase Settings > API
NEXT_PUBLIC_SUPABASE_ANON_KEY - from Supabase Settings > API
Run npm install
Run npm run dev
Open http://localhost:3000
Deploy to Vercel (Free)
Push this project to GitHub
Go to https://vercel.com and import your repository
Add Environment Variables:
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
Click Deploy
Demo Accounts
Role	Email	Password
Admin	admin@medconnect.com	admin123
Doctor	Create via Admin or Register	
Patient	Create via Admin or Register	
Features
Patient Management (Registration, Profile, Medical History)
Doctor Management (Specialization, Experience, Availability)
Appointment Booking (Online booking, Reschedule, Cancel)
Medical Records (Diagnoses, Treatments, Prescriptions, Test Results)
Notifications (Automated alerts for appointments)
Role-based access (Patient, Doctor, Admin)
Responsive design for all devices
Tech Stack
Next.js 14 (App Router)
React 18 + TypeScript
Tailwind CSS
Supabase (PostgreSQL + Auth)
Lucide React Icons
