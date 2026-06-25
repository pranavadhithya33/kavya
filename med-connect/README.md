# MedConnect

Smart Healthcare and Appointment Management System built with Next.js 14 + Supabase.

## Setup

1. Create a free Supabase project at https://supabase.com
2. Open the SQL Editor in your Supabase dashboard
3. Copy the contents of `supabase-schema.sql` and run it
4. Copy `.env.local` to `.env.local` and fill in your Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL` - from Supabase Settings > API
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - from Supabase Settings > API
5. Run `npm install`
6. Run `npm run dev`
7. Open http://localhost:3000

## Deploy to Vercel (Free)

1. Push this project to GitHub
2. Go to https://vercel.com and import your repository
3. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click Deploy

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@medconnect.com | admin123 |
| Doctor | Create via Admin or Register | |
| Patient | Create via Admin or Register | |

## Features

- Patient Management (Registration, Profile, Medical History)
- Doctor Management (Specialization, Experience, Availability)
- Appointment Booking (Online booking, Reschedule, Cancel)
- Medical Records (Diagnoses, Treatments, Prescriptions, Test Results)
- Notifications (Automated alerts for appointments)
- Role-based access (Patient, Doctor, Admin)
- Responsive design for all devices

## Tech Stack

- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + Auth)
- Lucide React Icons
