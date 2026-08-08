import { useAuth } from '../context/AuthContext'
import { APP_NAME } from '../utils/constants'
import { formatDate } from '../utils/format'

export function SettingsPage() {
  const { user } = useAuth()

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900">
          Settings
        </h1>
        <p className="mt-1 text-slate-500">Account and product preferences for MVP.</p>
      </div>

      <section className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
        <h2 className="font-medium text-slate-900">Profile</h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
            <dt className="text-slate-500">Email</dt>
            <dd className="font-medium text-slate-800">{user?.email}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
            <dt className="text-slate-500">Member since</dt>
            <dd className="font-medium text-slate-800">
              {user?.created_at ? formatDate(user.created_at) : '—'}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Product</dt>
            <dd className="font-medium text-slate-800">{APP_NAME}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
        <h2 className="font-medium text-slate-900">Coming soon</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-500">
          <li>• Custom subtitle styles & TikTok captions</li>
          <li>• Turkmen → English translation</li>
          <li>• Team workspaces & Stripe billing</li>
        </ul>
      </section>
    </div>
  )
}
