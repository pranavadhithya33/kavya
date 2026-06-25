import Link from 'next/link'
import { 
  Stethoscope, 
  Calendar, 
  FileText, 
  Bell, 
  Shield, 
  Clock, 
  Users, 
  ChevronRight 
} from 'lucide-react'

export default function Home() {
  const features = [
    {
      icon: Calendar,
      title: 'Online Appointment Booking',
      description: 'Book, reschedule, or cancel appointments with your preferred doctors anytime, anywhere.',
    },
    {
      icon: FileText,
      title: 'Digital Medical Records',
      description: 'Access your complete medical history, diagnoses, prescriptions, and test results securely.',
    },
    {
      icon: Bell,
      title: 'Automated Notifications',
      description: 'Receive timely reminders and alerts about upcoming appointments and health updates.',
    },
    {
      icon: Shield,
      title: 'Secure & Confidential',
      description: 'Your health data is protected with industry-standard security and privacy measures.',
    },
    {
      icon: Clock,
      title: 'Real-time Availability',
      description: 'View doctor schedules and book slots that work best for you instantly.',
    },
    {
      icon: Users,
      title: 'Doctor-Patient Connection',
      description: 'Seamless communication between patients and healthcare providers.',
    },
  ]

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-medical-50 via-white to-blue-50 pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-medical-100 text-medical-700 rounded-full text-sm font-medium mb-6">
              <Stethoscope className="w-4 h-4" />
              Smart Healthcare Management
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6">
              Your Health,{' '}
              <span className="text-medical-600">Simplified</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed">
              MedConnect provides a centralized platform for patients and healthcare providers 
              to manage appointments, medical records, and communications efficiently.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="btn-primary text-lg px-8 py-3 w-full sm:w-auto"
              >
                Get Started
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="btn-secondary text-lg px-8 py-3 w-full sm:w-auto"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-medical-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need for Better Healthcare
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform connects patients, doctors, and administrators 
              in one seamless ecosystem.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="card p-6 hover:shadow-md transition-shadow group"
                >
                  <div className="w-12 h-12 bg-medical-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-medical-100 transition-colors">
                    <Icon className="w-6 h-6 text-medical-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-medical-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Healthcare Experience?
          </h2>
          <p className="text-medical-100 mb-8 text-lg">
            Join thousands of patients and doctors already using MedConnect.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-medical-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors w-full sm:w-auto"
            >
              Create Account
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors w-full sm:w-auto"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-medical-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-lg">MedConnect</span>
            </div>
            <p className="text-sm">
              © 2024 MedConnect. Smart Healthcare and Appointment Management System.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
