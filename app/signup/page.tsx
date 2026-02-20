"use client"

import { FormEvent, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, AtSign, Mail, Phone, Globe2, Briefcase, Lock, ArrowRight } from "lucide-react"

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

export default function SignupPage() {
  const router = useRouter()
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

  const canSubmit = useMemo(() => {
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setErrorMessage("")

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match")
      return
    }

    if (!formData.termsAccepted) {
      setErrorMessage("Please accept the Terms of Service and Privacy Policy")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

      const data = (await response.json()) as { message?: string }
      if (!response.ok) {
        setErrorMessage(data.message ?? "Signup failed")
        return
      }

      router.push("/dashboard")
    } catch {
      setErrorMessage("Unable to connect to server. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg">
        <form onSubmit={handleSubmit}>
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

              <Button type="submit" className="w-full" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? "Creating account..." : "Create Account"}
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
