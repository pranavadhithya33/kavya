import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Calendar, FileText, CheckCircle2, XCircle, Clock } from 'lucide-react'

export default async function AdminReports() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'admin') redirect('/login')

  const { data: appointments } = await supabase
    .from('appointments')
    .select('status')

  const total = appointments?.length || 0
  const confirmed = appointments?.filter(a => a.status === 'confirmed').length || 0
  const pending = appointments?.filter(a => a.status === 'pending').length || 0
  const completed = appointments?.filter(a => a.status === 'completed').length || 0
  const cancelled = appointments?.filter(a => a.status === 'cancelled').length || 0

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*, user:user_id(name)')
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Notifications</h1>
        <p className="text-gray-500 mt-1">System overview and activity log</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center"><Calendar className="w-5 h-5 text-blue-600" /></div>
            <div className="text-2xl font-bold text-gray-900">{total}</div>
          </div>
          <p className="text-sm text-gray-500">Total Appointments</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-green-600" /></div>
            <div className="text-2xl font-bold text-gray-900">{confirmed}</div>
          </div>
          <p className="text-sm text-gray-500">Confirmed</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center"><Clock className="w-5 h-5 text-amber-600" /></div>
            <div className="text-2xl font-bold text-gray-900">{pending}</div>
          </div>
          <p className="text-sm text-gray-500">Pending</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center"><FileText className="w-5 h-5 text-purple-600" /></div>
            <div className="text-2xl font-bold text-gray-900">{completed}</div>
          </div>
          <p className="text-sm text-gray-500">Completed</p>
        </div>
      </div>

      <div className="card">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Notifications</h2>
          <p className="text-sm text-gray-500 mt-1">System-wide notification history</p>
        </div>
        <div className="p-6">
          {notifications && notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((n: any) => (
                <div key={n.id} className={`p-3 rounded-lg border ${n.is_read ? 'bg-gray-50 border-gray-100' : 'bg-medical-50 border-medical-100'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">{n.title}</p>
                    <span className="text-xs text-gray-400">{new Date(n.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-600">{n.message}</p>
                  <p className="text-xs text-gray-500 mt-1">To: {n.user?.name || 'Unknown'}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No notifications found</div>
          )}
        </div>
      </div>
    </div>
  )
}
