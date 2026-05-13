"use client"

import { useState, FormEvent, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  User,
  Lock,
  Trash2,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Bell,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  LogOut,
  Globe,
} from "lucide-react"
import { toast } from "sonner"

interface UserProfile {
  firstName: string
  lastName: string
  username: string
  email: string
  phone: string
  country: string
  creatorCategory?: string
  createdAt?: string
  emailVerified?: boolean
}

interface SettingsViewProps {
  user: UserProfile
  onProfileUpdated: (u: { username: string; email: string }) => void
}

type SettingsTab = "profile" | "security" | "notifications" | "danger"

export function SettingsView({ user, onProfileUpdated }: SettingsViewProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile")

  // ---- Profile form ----
  const [profile, setProfile] = useState<UserProfile>({ ...user })
  const [profileSaving, setProfileSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopyProfileUrl = useCallback(async () => {
    const url = `https://app.lynkpay.co/${profile.username}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [profile.username])

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setProfileSaving(true)
    try {
      const res = await fetch("/api/settings/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message || "Failed to update profile")
        return
      }
      toast.success("Profile updated successfully")
      onProfileUpdated({ username: profile.username, email: profile.email })
    } catch {
      toast.error("Network error")
    } finally {
      setProfileSaving(false)
    }
  }

  // ---- Password form ----
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })
  const [pwSaving, setPwSaving] = useState(false)
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (pw.newPassword !== pw.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    if (pw.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }
    setPwSaving(true)
    try {
      const res = await fetch("/api/settings/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pw),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message || "Failed to change password")
        return
      }
      toast.success("Password changed successfully")
      setPw({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch {
      toast.error("Network error")
    } finally {
      setPwSaving(false)
    }
  }

  // ---- Logout ----
  const [loggingOut, setLoggingOut] = useState(false)
  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await fetch("/api/logout", { method: "POST" })
      router.push("/login")
    } catch {
      toast.error("Failed to logout")
      setLoggingOut(false)
    }
  }

  // ---- Delete account ----
  const [deletePassword, setDeletePassword] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Enter your password to confirm deletion")
      return
    }
    if (deleteConfirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm")
      return
    }
    setDeleting(true)
    try {
      const res = await fetch("/api/settings/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message || "Failed to delete account")
        return
      }
      toast.success("Account deleted")
      router.push("/")
    } catch {
      toast.error("Network error")
    } finally {
      setDeleting(false)
    }
  }

  // ---- Notification preferences (local state for now) ----
  const [notifications, setNotifications] = useState({
    emailMarketing: true,
    emailTransactions: true,
    emailSecurity: true,
    pushNotifications: false,
  })

  const inputCls =
    "w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-colors"
  const labelCls = "block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wide"
  const btnPrimary =
    "flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"

  const tabs: { id: SettingsTab; label: string; icon: typeof User }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "danger", label: "Danger Zone", icon: AlertCircle },
  ]

  const initials = `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase() || "?"

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Member"

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header Card */}
      <div className="rounded-2xl border border-zinc-800/50 bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-emerald-500/20">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-zinc-900 flex items-center justify-center">
              <CheckCircle2 size={12} className="text-white" />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white mb-1">
              {profile.firstName} {profile.lastName}
            </h1>
            <p className="text-zinc-400 text-sm mb-3">@{profile.username}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Mail size={12} />
                {profile.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={12} />
                {memberSince}
              </span>
              {profile.creatorCategory && (
                <span className="flex items-center gap-1.5">
                  <Globe size={12} />
                  {profile.creatorCategory}
                </span>
              )}
            </div>
          </div>

          {/* Profile URL */}
          <div className="w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-2.5">
              <span className="text-xs text-zinc-500 truncate">app.lynkpay.co/{profile.username}</span>
              <button
                onClick={handleCopyProfileUrl}
                className="p-1.5 rounded-lg hover:bg-zinc-800 transition-colors shrink-0"
              >
                {copied ? (
                  <Check size={14} className="text-emerald-500" />
                ) : (
                  <Copy size={14} className="text-zinc-400" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-zinc-900/50 rounded-xl mb-6 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? "bg-zinc-800 text-white"
                  : tab.id === "danger"
                    ? "text-red-400 hover:text-red-300 hover:bg-red-950/30"
                    : "text-zinc-500 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="rounded-2xl border border-zinc-800/50 bg-zinc-950/80 p-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <User size={18} className="text-emerald-500" />
                Personal Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>First Name</label>
                  <input
                    className={inputCls}
                    value={profile.firstName}
                    onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))}
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>Last Name</label>
                  <input
                    className={inputCls}
                    value={profile.lastName}
                    onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))}
                    placeholder="Doe"
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>Username</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 text-sm">@</span>
                    <input
                      className={`${inputCls} pl-8`}
                      value={profile.username}
                      onChange={(e) => setProfile((p) => ({ ...p, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") }))}
                      placeholder="username"
                      required
                      minLength={3}
                      maxLength={30}
                    />
                  </div>
                  <p className="text-xs text-zinc-600 mt-1">Only letters, numbers, and underscores</p>
                </div>
                <div>
                  <label className={labelCls}>Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                    <input
                      className={`${inputCls} pl-11`}
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Phone Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                    <input
                      className={`${inputCls} pl-11`}
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Country</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                    <input
                      className={`${inputCls} pl-11`}
                      value={profile.country}
                      onChange={(e) => setProfile((p) => ({ ...p, country: e.target.value }))}
                      placeholder="United States"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-6 border-t border-zinc-800/50">
                <button type="submit" className={btnPrimary} disabled={profileSaving}>
                  {profileSaving && <Loader2 size={16} className="animate-spin" />}
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="space-y-6">
            {/* Change Password */}
            <form onSubmit={handlePasswordSubmit} className="rounded-2xl border border-zinc-800/50 bg-zinc-950/80 p-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Lock size={18} className="text-emerald-500" />
                Change Password
              </h2>

              <div className="space-y-4 max-w-md">
                <div>
                  <label className={labelCls}>Current Password</label>
                  <div className="relative">
                    <input
                      className={inputCls}
                      type={showCurrentPw ? "text" : "password"}
                      value={pw.currentPassword}
                      onChange={(e) => setPw((p) => ({ ...p, currentPassword: e.target.value }))}
                      placeholder="Enter current password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPw(!showCurrentPw)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
                    >
                      {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>New Password</label>
                  <div className="relative">
                    <input
                      className={inputCls}
                      type={showNewPw ? "text" : "password"}
                      value={pw.newPassword}
                      onChange={(e) => setPw((p) => ({ ...p, newPassword: e.target.value }))}
                      placeholder="Enter new password"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPw(!showNewPw)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
                    >
                      {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <p className="text-xs text-zinc-600 mt-1">Minimum 8 characters</p>
                </div>
                <div>
                  <label className={labelCls}>Confirm New Password</label>
                  <div className="relative">
                    <input
                      className={inputCls}
                      type={showConfirmPw ? "text" : "password"}
                      value={pw.confirmPassword}
                      onChange={(e) => setPw((p) => ({ ...p, confirmPassword: e.target.value }))}
                      placeholder="Confirm new password"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPw(!showConfirmPw)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
                    >
                      {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-start mt-6 pt-6 border-t border-zinc-800/50">
                <button type="submit" className={btnPrimary} disabled={pwSaving}>
                  {pwSaving && <Loader2 size={16} className="animate-spin" />}
                  Update Password
                </button>
              </div>
            </form>

            {/* Active Sessions / Logout */}
            <div className="rounded-2xl border border-zinc-800/50 bg-zinc-950/80 p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <LogOut size={18} className="text-emerald-500" />
                Sessions
              </h2>
              <p className="text-sm text-zinc-400 mb-4">
                Manage your active sessions. Logging out will end your current session and you&apos;ll need to sign in again.
              </p>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-2 rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                {loggingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="rounded-2xl border border-zinc-800/50 bg-zinc-950/80 p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Bell size={18} className="text-emerald-500" />
              Notification Preferences
            </h2>

            <div className="space-y-4">
              {[
                { key: "emailTransactions", label: "Transaction Emails", desc: "Get notified when you receive a payment or make a sale" },
                { key: "emailSecurity", label: "Security Alerts", desc: "Important alerts about your account security" },
                { key: "emailMarketing", label: "Marketing Emails", desc: "Tips, product updates, and promotional content" },
                { key: "pushNotifications", label: "Push Notifications", desc: "Real-time notifications in your browser (coming soon)" },
              ].map((item) => (
                <div key={item.key} className="flex items-start justify-between gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                  <div>
                    <p className="text-sm font-medium text-white">{item.label}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications((n) => ({ ...n, [item.key]: !n[item.key as keyof typeof notifications] }))}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      notifications[item.key as keyof typeof notifications] ? "bg-emerald-600" : "bg-zinc-700"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        notifications[item.key as keyof typeof notifications] ? "left-7" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <p className="text-xs text-zinc-600 mt-4">
              Note: Notification preferences are saved locally. Full notification settings will be available soon.
            </p>
          </div>
        )}

        {/* Danger Zone Tab */}
        {activeTab === "danger" && (
          <div className="rounded-2xl border border-red-900/30 bg-red-950/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <Trash2 size={18} className="text-red-500" />
              Delete Account
            </h2>
            <p className="text-sm text-zinc-400 mb-6">
              Once you delete your account, there is no going back. This action is permanent and will remove all your data, blocks, products, and settings.
            </p>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="rounded-xl border border-red-800/50 bg-red-950/50 px-5 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-900/40 transition-colors"
              >
                I want to delete my account
              </button>
            ) : (
              <div className="space-y-4 max-w-md">
                <div className="p-4 rounded-xl bg-red-950/30 border border-red-900/30">
                  <p className="text-sm text-red-300 font-medium mb-2">Are you absolutely sure?</p>
                  <p className="text-xs text-red-400/70">
                    This will permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>
                <div>
                  <label className={labelCls}>Type DELETE to confirm</label>
                  <input
                    className={`${inputCls} border-red-900/50 focus:border-red-500/50 focus:ring-red-500/30`}
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
                    placeholder="DELETE"
                  />
                </div>
                <div>
                  <label className={labelCls}>Enter your password</label>
                  <input
                    className={`${inputCls} border-red-900/50 focus:border-red-500/50 focus:ring-red-500/30`}
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Your current password"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleting || deleteConfirmText !== "DELETE"}
                    className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleting && <Loader2 size={16} className="animate-spin" />}
                    Permanently Delete Account
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false)
                      setDeletePassword("")
                      setDeleteConfirmText("")
                    }}
                    className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
