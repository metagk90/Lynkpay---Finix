"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { User, Lock, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface UserProfile {
  firstName: string
  lastName: string
  username: string
  email: string
  phone: string
  country: string
}

interface SettingsViewProps {
  user: UserProfile
  onProfileUpdated: (u: { username: string; email: string }) => void
}

export function SettingsView({ user, onProfileUpdated }: SettingsViewProps) {
  const router = useRouter()

  // ---- Profile form ----
  const [profile, setProfile] = useState<UserProfile>({ ...user })
  const [profileSaving, setProfileSaving] = useState(false)

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
      toast.success("Profile updated")
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

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (pw.newPassword !== pw.confirmPassword) {
      toast.error("Passwords do not match")
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
      toast.success("Password changed")
      setPw({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch {
      toast.error("Network error")
    } finally {
      setPwSaving(false)
    }
  }

  // ---- Delete account ----
  const [deletePassword, setDeletePassword] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Enter your password to confirm deletion")
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

  const inputCls =
    "w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-colors"
  const labelCls = "block text-xs font-semibold text-zinc-400 mb-1.5"
  const btnPrimary =
    "flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"

  return (
    <div className="max-w-2xl space-y-8">
      {/* Profile Section */}
      <form onSubmit={handleProfileSubmit} className="rounded-2xl border border-zinc-900/50 bg-zinc-950/80 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <User size={18} className="text-emerald-500" />
          </div>
          <h2 className="text-lg font-bold text-white">Profile Information</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>First Name</label>
            <input
              className={inputCls}
              value={profile.firstName}
              onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className={labelCls}>Last Name</label>
            <input
              className={inputCls}
              value={profile.lastName}
              onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className={labelCls}>Username</label>
            <input
              className={inputCls}
              value={profile.username}
              onChange={(e) => setProfile((p) => ({ ...p, username: e.target.value }))}
              required
              minLength={3}
              maxLength={30}
            />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input
              className={inputCls}
              type="email"
              value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input
              className={inputCls}
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelCls}>Country</label>
            <input
              className={inputCls}
              value={profile.country}
              onChange={(e) => setProfile((p) => ({ ...p, country: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button type="submit" className={btnPrimary} disabled={profileSaving}>
            {profileSaving && <Loader2 size={16} className="animate-spin" />}
            Save Changes
          </button>
        </div>
      </form>

      {/* Password Section */}
      <form onSubmit={handlePasswordSubmit} className="rounded-2xl border border-zinc-900/50 bg-zinc-950/80 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <Lock size={18} className="text-emerald-500" />
          </div>
          <h2 className="text-lg font-bold text-white">Change Password</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelCls}>Current Password</label>
            <input
              className={inputCls}
              type="password"
              value={pw.currentPassword}
              onChange={(e) => setPw((p) => ({ ...p, currentPassword: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>New Password</label>
              <input
                className={inputCls}
                type="password"
                value={pw.newPassword}
                onChange={(e) => setPw((p) => ({ ...p, newPassword: e.target.value }))}
                required
                minLength={8}
              />
            </div>
            <div>
              <label className={labelCls}>Confirm Password</label>
              <input
                className={inputCls}
                type="password"
                value={pw.confirmPassword}
                onChange={(e) => setPw((p) => ({ ...p, confirmPassword: e.target.value }))}
                required
                minLength={8}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button type="submit" className={btnPrimary} disabled={pwSaving}>
            {pwSaving && <Loader2 size={16} className="animate-spin" />}
            Update Password
          </button>
        </div>
      </form>

      {/* Delete Account Section */}
      <div className="rounded-2xl border border-red-900/30 bg-red-950/10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-red-500/10">
            <Trash2 size={18} className="text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-white">Delete Account</h2>
        </div>
        <p className="text-sm text-zinc-400 mb-4">
          This action is permanent and cannot be undone. All your data, blocks, and settings will be deleted.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-xl border border-red-800/50 bg-red-950/50 px-5 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-900/40 transition-colors"
          >
            Delete My Account
          </button>
        ) : (
          <div className="space-y-3">
            <div>
              <label className={labelCls}>Enter your password to confirm</label>
              <input
                className={inputCls}
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Your current password"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting && <Loader2 size={16} className="animate-spin" />}
                Permanently Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setDeletePassword("")
                }}
                className="rounded-xl border border-zinc-800 px-5 py-2.5 text-sm font-semibold text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
