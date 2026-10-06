import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  Bell,
  Check,
  Lock,
  Monitor,
  Moon,
  Palette,
  Save,
  Shield,
  Sun,
  User,
} from 'lucide-react'

export const Route = createFileRoute('/_app/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const [name, setName] = useState('Demo Clinician')
  const [email, setEmail] = useState('clinician@medisecond.demo')

  const [notifications, setNotifications] = useState(true)
  const [criticalAlerts, setCriticalAlerts] = useState(true)
  const [dailySummary, setDailySummary] = useState(false)

  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
  if (typeof window === 'undefined') return 'system'

  return (
    (localStorage.getItem('medisecond-theme') as
      | 'light'
      | 'dark'
      | 'system') || 'system'
  )
})
useEffect(() => {
  const root = document.documentElement

  function applyTheme(selectedTheme: 'light' | 'dark' | 'system') {
    const isDark =
      selectedTheme === 'dark' ||
      (selectedTheme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)

    root.classList.toggle('dark', isDark)
  }

  localStorage.setItem('medisecond-theme', theme)

  applyTheme(theme)

  if (theme === 'system') {
    const mediaQuery = window.matchMedia(
      '(prefers-color-scheme: dark)',
    )

    const handleChange = () => applyTheme('system')

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }
}, [theme])

  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)

    setTimeout(() => {
      setSaved(false)
    }, 2500)
  }

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <User className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Settings
            </h1>

            <p className="text-sm text-slate-500">
              Manage your account and application preferences
            </p>
          </div>
        </div>
      </div>

      {/* Profile */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-slate-600" />

            <div>
              <h2 className="font-semibold text-slate-900">
                Profile
              </h2>

              <p className="text-sm text-slate-500">
                Your clinician account information
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Display name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
              placeholder="Enter your email"
              type="email"
            />
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-slate-600" />

            <div>
              <h2 className="font-semibold text-slate-900">
                Notifications
              </h2>

              <p className="text-sm text-slate-500">
                Control which notifications you receive
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          <SettingRow
            title="Enable notifications"
            description="Receive application notifications"
            enabled={notifications}
            onChange={setNotifications}
          />

          <SettingRow
            title="Critical safety alerts"
            description="Notify me when a critical medication alert is generated"
            enabled={criticalAlerts}
            onChange={setCriticalAlerts}
          />

          <SettingRow
            title="Daily summary"
            description="Receive a summary of medication safety activity"
            enabled={dailySummary}
            onChange={setDailySummary}
          />
        </div>
      </section>

      {/* Appearance */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="border-b border-slate-200 p-6 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <Palette className="h-5 w-5 text-slate-600 dark:text-slate-300" />

            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Appearance
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Choose how MediSecond looks
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 p-6 md:grid-cols-3">
          <ThemeButton
            label="Light"
            icon={<Sun className="h-5 w-5" />}
            active={theme === 'light'}
            onClick={() => setTheme('light')}
          />

          <ThemeButton
            label="Dark"
            icon={<Moon className="h-5 w-5" />}
            active={theme === 'dark'}
            onClick={() => setTheme('dark')}
          />

          <ThemeButton
            label="System"
            icon={<Monitor className="h-5 w-5" />}
            active={theme === 'system'}
            onClick={() => setTheme('system')}
          />
        </div>

        
      </section>

      {/* Security */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-slate-600" />

            <div>
              <h2 className="font-semibold text-slate-900">
                Security
              </h2>

              <p className="text-sm text-slate-500">
                Account security and access
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          <ActionRow
            icon={<Lock className="h-5 w-5" />}
            title="Change password"
            description="Update your account password"
            buttonText="Change"
            onClick={() =>
              alert('Password management will be connected later.')
            }
          />

          <ActionRow
            icon={<Shield className="h-5 w-5" />}
            title="Two-factor authentication"
            description="Add an additional layer of account security"
            buttonText="Configure"
            onClick={() =>
              alert('Two-factor authentication will be connected later.')
            }
          />
        </div>
      </section>

      {/* Save */}
      <div className="flex items-center justify-end gap-3 pb-6">
        {saved && (
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
            <Check className="h-4 w-4" />
            Settings saved
          </div>
        )}

        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>

      {/* Demo warning */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-4">
        <p className="font-medium text-blue-900">
          Demo settings
        </p>

        <p className="mt-1 text-sm text-blue-700">
          These settings are currently stored only in the current
          browser session. Permanent account settings will require
          the real authentication and backend system.
        </p>
      </div>
    </div>
  )
}

function SettingRow({
  title,
  description,
  enabled,
  onChange,
}: {
  title: string
  description: string
  enabled: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-5">
      <div>
        <p className="text-sm font-medium text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? 'bg-slate-900' : 'bg-slate-300'
        }`}
        aria-label={title}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            enabled ? 'left-6' : 'left-1'
          }`}
        />
      </button>
    </div>
  )
}

function ThemeButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string
  icon: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
        active
          ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
          : 'border-slate-200 hover:border-slate-400'
      }`}
    >
      <div className="text-slate-700">{icon}</div>

      <div>
        <p className="text-sm font-semibold text-slate-900">
          {label}
        </p>

        {active && (
          <p className="mt-0.5 text-xs text-slate-500">
            Selected
          </p>
        )}
      </div>
    </button>
  )
}

function ActionRow({
  icon,
  title,
  description,
  buttonText,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  description: string
  buttonText: string
  onClick: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          {icon}
        </div>

        <div>
          <p className="text-sm font-medium text-slate-900">
            {title}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClick}
        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        {buttonText}
      </button>
    </div>
  )
}