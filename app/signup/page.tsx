"use client"

import { FormEvent, useMemo, useState, useCallback, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, AtSign, Mail, Phone, Globe2, Briefcase, Lock, ArrowRight, ArrowLeft, CheckCircle2, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Step = "form" | "otp" | "complete"

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("form")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    country: "",
    creatorCategory: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  })

  // OTP state
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [otpResendCooldown, setOtpResendCooldown] = useState(0)
  const [otpExpiresIn, setOtpExpiresIn] = useState(0)
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (otpResendCooldown > 0) {
      const timer = setTimeout(() => setOtpResendCooldown((c) => c - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [otpResendCooldown])

  // Countdown timer for OTP expiry
  useEffect(() => {
    if (otpExpiresIn > 0) {
      const timer = setTimeout(() => setOtpExpiresIn((c) => c - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [otpExpiresIn])

  const canSubmitForm = useMemo(() => {
    return (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.username.trim() &&
      formData.email.trim() &&
      formData.password &&
      formData.confirmPassword &&
      formData.termsAccepted
    )
  }, [formData])

  const sendOtp = useCallback(async () => {
    setErrorMessage("")
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, firstName: formData.firstName }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMessage(data.error || "Failed to send verification code")
        return false
      }
      setOtpExpiresIn(data.expiresIn || 600)
      setOtpResendCooldown(60)
      return true
    } catch {
      setErrorMessage("Unable to connect to server")
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [formData.email, formData.firstName])

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault()
    console.log("[v0] handleFormSubmit called", { formData })
    setErrorMessage("")

    if (formData.password !== formData.confirmPassword) {
      console.log("[v0] Passwords do not match")
      setErrorMessage("Passwords do not match")
      return
    }

    if (!formData.termsAccepted) {
      console.log("[v0] Terms not accepted")
      setErrorMessage("Please accept the Terms of Service and Privacy Policy")
      return
    }

    // Send OTP and move to verification step
    console.log("[v0] Sending OTP...")
    const sent = await sendOtp()
    console.log("[v0] OTP send result:", sent)
    if (sent) {
      setStep("otp")
      setOtp(["", "", "", "", "", ""])
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return // Only allow digits

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // Only take last digit
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (pastedData.length === 6) {
      setOtp(pastedData.split(""))
      otpInputRefs.current[5]?.focus()
    }
  }

  const verifyOtpAndSignup = async () => {
    setErrorMessage("")
    const otpCode = otp.join("")
    if (otpCode.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit code")
      return
    }

    setIsSubmitting(true)
    try {
      // First verify the OTP
      const verifyRes = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: otpCode }),
      })
      const verifyData = await verifyRes.json()
      if (!verifyRes.ok) {
        setErrorMessage(verifyData.error || "Verification failed")
        return
      }

      // OTP verified, now complete signup
      const signupRes = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          creatorCategory: formData.creatorCategory,
          password: formData.password,
        }),
      })
      const signupData = await signupRes.json()
      if (!signupRes.ok) {
        setErrorMessage(signupData.message || "Signup failed")
        return
      }

      setStep("complete")
      setTimeout(() => router.push("/dashboard"), 2000)
    } catch {
      setErrorMessage("Unable to connect to server")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Step: OTP Verification
  if (step === "otp") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="border-border/50 bg-card">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Verify Your Email</CardTitle>
              <CardDescription className="text-muted-foreground">
                We sent a 6-digit code to<br />
                <span className="font-medium text-foreground">{formData.email}</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-6">
              {/* OTP Input */}
              <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => { otpInputRefs.current[index] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="h-14 w-12 text-center text-2xl font-bold"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {/* Timer and Resend */}
              <div className="flex flex-col items-center gap-2 text-sm">
                {otpExpiresIn > 0 && (
                  <p className="text-muted-foreground">
                    Code expires in <span className="font-medium text-foreground">{formatTime(otpExpiresIn)}</span>
                  </p>
                )}
                {otpResendCooldown > 0 ? (
                  <p className="text-muted-foreground">
                    Resend code in <span className="font-medium">{otpResendCooldown}s</span>
                  </p>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={sendOtp}
                    disabled={isSubmitting}
                    className="gap-1"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Resend Code
                  </Button>
                )}
              </div>

              {errorMessage && <p className="text-center text-sm text-destructive">{errorMessage}</p>}

              <div className="flex flex-col gap-3">
                <Button
                  onClick={verifyOtpAndSignup}
                  disabled={isSubmitting || otp.join("").length !== 6}
                  className="w-full"
                >
                  {isSubmitting ? "Verifying..." : "Verify & Create Account"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => { setStep("form"); setErrorMessage("") }}
                  className="gap-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sign Up
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Step: Success
  if (step === "complete") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="border-border/50 bg-card">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle2 className="h-7 w-7 text-emerald-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Account Created!</CardTitle>
              <CardDescription className="text-muted-foreground">
                Welcome to LynkPay, <span className="font-medium text-foreground">{formData.firstName}</span>!
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                Redirecting you to your dashboard...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Step: Form (default)
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg">
        <form onSubmit={handleFormSubmit}>
          <Card className="border-border/50 bg-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-foreground">Get Started</CardTitle>
              <CardDescription className="text-muted-foreground">Create your account</CardDescription>
              <p className="text-sm text-muted-foreground">
                Create your profile to access your creator dashboard.
              </p>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="firstName" className="text-foreground">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="firstName" placeholder="John" className="pl-10" value={formData.firstName} onChange={(event) => setFormData((prev) => ({ ...prev, firstName: event.target.value }))} required />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="lastName" className="text-foreground">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" value={formData.lastName} onChange={(event) => setFormData((prev) => ({ ...prev, lastName: event.target.value }))} required />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="username" className="text-foreground">Username</Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="username" placeholder="johncreator" className="pl-10" value={formData.username} onChange={(event) => setFormData((prev) => ({ ...prev, username: event.target.value }))} required />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="you@email.com" className="pl-10" value={formData.email} onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="phone" type="tel" placeholder="+1 234 567 890" className="pl-10" value={formData.phone} onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))} />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="country" className="text-foreground">Country</Label>
                  <div className="relative">
                    <Globe2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Select value={formData.country} onValueChange={(value) => setFormData((prev) => ({ ...prev, country: value }))}>
                      <SelectTrigger className="pl-10"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="GB">United Kingdom</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="category" className="text-foreground">Creator Category</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Select value={formData.creatorCategory} onValueChange={(value) => setFormData((prev) => ({ ...prev, creatorCategory: value }))}>
                    <SelectTrigger className="pl-10"><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="content-creator">Content Creator</SelectItem>
                      <SelectItem value="coach">Coach / Consultant</SelectItem>
                      <SelectItem value="educator">Educator</SelectItem>
                      <SelectItem value="freelancer">Freelancer</SelectItem>
                      <SelectItem value="business">Business Owner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="password" className="text-foreground">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="password" type="password" placeholder="Min. 8 characters" className="pl-10" value={formData.password} onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))} required />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="confirmPassword" type="password" placeholder="Re-enter password" className="pl-10" value={formData.confirmPassword} onChange={(event) => setFormData((prev) => ({ ...prev, confirmPassword: event.target.value }))} required />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox id="terms" checked={formData.termsAccepted} onCheckedChange={(value) => setFormData((prev) => ({ ...prev, termsAccepted: value === true }))} />
                <Label htmlFor="terms" className="text-xs leading-relaxed text-muted-foreground">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                </Label>
              </div>

              {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

              <Button type="submit" className="w-full" disabled={!canSubmitForm || isSubmitting}>
                {isSubmitting ? "Sending verification code..." : "Continue"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">Login</Link>
              </p>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
