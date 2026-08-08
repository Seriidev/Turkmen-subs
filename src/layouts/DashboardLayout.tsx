import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { APP_NAME, AUTH_DISABLED } from '../utils/constants'
import { Button } from '../components/ui/Button'

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1' },
  { to: '/upload', label: 'New Upload', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
  { to: '/history', label: 'History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { to: '/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0' },
]

export function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-full bg-surface">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white/80 px-4 py-6 backdrop-blur lg:flex">
        <div className="mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-sm font-bold text-white shadow-md shadow-brand-600/30">
              TS
            </div>
            <div>
              <p className="font-display text-sm font-semibold text-slate-900">{APP_NAME}</p>
              <p className="text-[11px] text-slate-400">Turkmen-first captions</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={item.icon} />
              </svg>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl bg-slate-50 p-3">
          <p className="truncate text-sm font-medium text-slate-800">
            {AUTH_DISABLED ? 'Guest (auth off)' : user?.email}
          </p>
          {!AUTH_DISABLED && (
            <Button
              variant="ghost"
              className="mt-2 w-full !justify-start !px-2"
              onClick={() => {
                logout()
                navigate('/login')
              }}
            >
              Logout
            </Button>
          )}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-slate-200/80 bg-white/80 px-4 py-3 backdrop-blur sm:px-8">
          <div className="lg:hidden">
            <p className="font-display text-sm font-semibold">{APP_NAME}</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Button onClick={() => navigate('/upload')}>New Upload</Button>
            <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700 sm:flex">
              {(user?.email?.[0] || 'U').toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">
          <Outlet />
        </main>

        <nav className="sticky bottom-0 flex border-t border-slate-200 bg-white lg:hidden">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-1 py-2 text-[11px] ${
                  isActive ? 'text-brand-600' : 'text-slate-500'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
