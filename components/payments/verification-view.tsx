"use client"

import { useState, useEffect, useRef } from "react"
import useSWR from "swr"
import {
  ShieldCheck,
  Upload,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Building2,
  Landmark,
  FileText,
  RefreshCw,
  XCircle,
  Loader2,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Info,
} from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const STEPS = [
  { id: 1, label: "Personal Info", icon: User, description: "Verify your identity" },
  { id: 2, label: "Business Info", icon: Building2, description: "Business details" },
  { id: 3, label: "Bank Account", icon: Landmark, description: "Add payout account" },
  { id: 4, label: "Documents", icon: FileText, description: "Upload required docs" },
]

const DOCUMENT_TYPES = [
  { key: "government_id", label: "Government ID", desc: "Passport, driver's license, or national ID" },
  { key: "proof_of_address", label: "Proof of Address", desc: "Utility bill or bank statement (last 3 months)" },
  { key: "business_registration", label: "Business Registration", desc: "Certificate of incorporation or equivalent" },
  { key: "tax_document", label: "Tax Document", desc: "Tax registration or EIN letter" },
]

interface IdentityEntity {
  first_name: string
  last_name: string
  email: string
  phone: string
  personal_address: {
    city: string
    country: string
    line1: string
    line2: string
    postal_code: string
    region: string
  }
  date_of_birth: { year: number; month: number; day: number } | null
  business_name: string
  business_type: string
  business_address: {
    city: string
    country: string
    line1: string
    line2: string
    postal_code: string
    region: string
  }
  doing_business_as: string
  business_phone: string
  tax_id: string
  mcc: string
  url: string
  max_transaction_amount: number
  annual_card_volume: number
  default_statement_descriptor: string
}

interface Identity {
  id: string
  created_at: string
  updated_at: string
  entity: IdentityEntity
  tags?: Record<string, string>
}

interface Verification {
  id: string
  state: string
  created_at: string
  updated_at: string
  processor: string
  raw?: string
  messages?: string[]
  identity: string | null
  merchant: string | null
  payment_instrument: string | null
}

interface PaymentInstrument {
  id: string
  type: string
  name: string
  account_type?: string
  bank_code?: string
  masked_account_number?: string
  country?: string
  currency?: string
  enabled: boolean
  created_at: string
}

export function VerificationView() {
  const [currentStep, setCurrentStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Personal fields
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [dobYear, setDobYear] = useState("")
  const [dobMonth, setDobMonth] = useState("")
  const [dobDay, setDobDay] = useState("")
  const [country, setCountry] = useState("US")
  const [city, setCity] = useState("")
  const [addressLine1, setAddressLine1] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [region, setRegion] = useState("")

  // Business
  const [businessName, setBusinessName] = useState("")
  const [businessType, setBusinessType] = useState("INDIVIDUAL_SOLE_PROPRIETORSHIP")
  const [doingBusinessAs, setDoingBusinessAs] = useState("")
  const [businessUrl, setBusinessUrl] = useState("")
  const [taxId, setTaxId] = useState("")
  const [mcc, setMcc] = useState("5734")
  const [bizLine1, setBizLine1] = useState("")
  const [bizCity, setBizCity] = useState("")
  const [bizRegion, setBizRegion] = useState("")
  const [bizPostal, setBizPostal] = useState("")

  // Bank account
  const [bankName, setBankName] = useState("")
  const [accountName, setAccountName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [routingNumber, setRoutingNumber] = useState("")
  const [accountType, setAccountType] = useState("SAVINGS")
  const [showAccountNum, setShowAccountNum] = useState(false)
  const [addingBank, setAddingBank] = useState(false)

  // Documents
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null)
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, { name: string; id: string }>>({})

  // Identity ID
  const [identityId, setIdentityId] = useState<string | null>(null)

  const { data: identitiesData, isLoading: loadingIdentities, mutate: mutateIdentities } = useSWR("/api/finix/identities?limit=1", fetcher, {
    revalidateOnFocus: false,
  })

  const existingIdentity: Identity | null = identitiesData?._embedded?.identities?.[0] || null
  const activeIdentityId = identityId || existingIdentity?.id

  const { data: verificationsData, isLoading: loadingVerifications, mutate: mutateVerifications } = useSWR(
    activeIdentityId ? `/api/finix/identities/${activeIdentityId}/verifications` : null,
    fetcher,
    { revalidateOnFocus: false }
  )

  // Payment instruments (bank accounts)
  const { data: piData, mutate: mutatePi } = useSWR(
    activeIdentityId ? `/api/finix/identities/${activeIdentityId}/payment-instruments` : null,
    fetcher,
    { revalidateOnFocus: false }
  )

  const bankAccounts: PaymentInstrument[] = (piData?._embedded?.payment_instruments || []).filter(
    (pi: PaymentInstrument) => pi.type === "BANK_ACCOUNT" && pi.enabled
  )

  const verifications: Verification[] = verificationsData?._embedded?.verifications || []
  const latestVerification = verifications[0] || null

  // Populate form from existing identity
  const populateFromIdentity = (identity: Identity) => {
    const e = identity.entity
    setFirstName(e.first_name || "")
    setLastName(e.last_name || "")
    setEmail(e.email || "")
    setPhone(e.phone || "")
    if (e.date_of_birth) {
      setDobYear(String(e.date_of_birth.year || ""))
      setDobMonth(String(e.date_of_birth.month || ""))
      setDobDay(String(e.date_of_birth.day || ""))
    }
    setCountry(e.personal_address?.country || "US")
    setCity(e.personal_address?.city || "")
    setAddressLine1(e.personal_address?.line1 || "")
    setPostalCode(e.personal_address?.postal_code || "")
    setRegion(e.personal_address?.region || "")
    setBusinessName(e.business_name || "")
    setBusinessType(e.business_type || "INDIVIDUAL_SOLE_PROPRIETORSHIP")
    setDoingBusinessAs(e.doing_business_as || "")
    setBusinessUrl(e.url || "")
    setTaxId(e.tax_id || "")
    setMcc(e.mcc || "5734")
    setBizLine1(e.business_address?.line1 || "")
    setBizCity(e.business_address?.city || "")
    setBizRegion(e.business_address?.region || "")
    setBizPostal(e.business_address?.postal_code || "")
  }

  const populatedRef = useRef(false)
  useEffect(() => {
    if (existingIdentity && !populatedRef.current) {
      populatedRef.current = true
      populateFromIdentity(existingIdentity)
    }
  }, [existingIdentity])

  const buildIdentityPayload = () => ({
    entity: {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      personal_address: { city, country, line1: addressLine1, postal_code: postalCode, region },
      ...(dobYear && dobMonth && dobDay
        ? { date_of_birth: { year: Number(dobYear), month: Number(dobMonth), day: Number(dobDay) } }
        : {}),
      business_name: businessName || `${firstName} ${lastName}`,
      business_type: businessType,
      doing_business_as: doingBusinessAs || businessName,
      business_phone: phone,
      business_address: {
        city: bizCity || city,
        country,
        line1: bizLine1 || addressLine1,
        postal_code: bizPostal || postalCode,
        region: bizRegion || region,
      },
      tax_id: taxId || "123456789",
      mcc,
      url: businessUrl || "https://lynkpay.com",
      max_transaction_amount: 1200000,
      annual_card_volume: 12000000,
      default_statement_descriptor: doingBusinessAs || businessName || "LYNKPAY",
    },
  })

  const handleSaveStep = async () => {
    setSaving(true)
    try {
      if (activeIdentityId) {
        await fetch(`/api/finix/identities/${activeIdentityId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildIdentityPayload()),
        })
      } else {
        const res = await fetch("/api/finix/identities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildIdentityPayload()),
        })
        const data = await res.json()
        if (data.id) setIdentityId(data.id)
      }
      mutateIdentities()
      setCurrentStep(Math.min(4, currentStep + 1))
    } catch {
      // silent
    } finally {
      setSaving(false)
    }
  }

  const handleAddBankAccount = async () => {
    if (!activeIdentityId || !accountNumber || !routingNumber) return
    setAddingBank(true)
    try {
      await fetch(`/api/finix/identities/${activeIdentityId}/payment-instruments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "BANK_ACCOUNT",
          name: accountName || `${firstName} ${lastName}`,
          account_number: accountNumber,
          bank_code: routingNumber,
          account_type: accountType,
          country,
          currency: "USD",
        }),
      })
      mutatePi()
      setAccountNumber("")
      setRoutingNumber("")
      setAccountName("")
      setBankName("")
    } catch {
      // silent
    } finally {
      setAddingBank(false)
    }
  }

  const handleRemoveBankAccount = async (piId: string) => {
    try {
      await fetch(`/api/finix/identities/${activeIdentityId}/payment-instruments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: piId, enabled: false }),
      })
      mutatePi()
    } catch {
      // silent
    }
  }

  const handleDocumentUpload = async (docKey: string, file: File) => {
    setUploadingDoc(docKey)
    try {
      // Step 1: Create a file resource
      const createRes = await fetch("/api/finix/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: `${docKey}_${file.name}`,
          tags: { document_type: docKey, identity_id: activeIdentityId || "" },
        }),
      })
      const fileResource = await createRes.json()

      if (fileResource.id) {
        // Step 2: Upload the actual file
        const formData = new FormData()
        formData.append("file", file)
        await fetch(`/api/finix/files/${fileResource.id}/upload`, {
          method: "PUT",
          body: formData,
        })

        setUploadedDocs((prev) => ({
          ...prev,
          [docKey]: { name: file.name, id: fileResource.id },
        }))
      }
    } catch {
      // silent
    } finally {
      setUploadingDoc(null)
    }
  }

  const handleSubmitVerification = async () => {
    if (!activeIdentityId) return
    setSubmitting(true)
    try {
      await fetch(`/api/finix/identities/${activeIdentityId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildIdentityPayload()),
      })
      await fetch(`/api/finix/identities/${activeIdentityId}/merchants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ processor: "DUMMY_V1" }),
      })
      await fetch(`/api/finix/identities/${activeIdentityId}/verifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      mutateVerifications()
      mutateIdentities()
    } catch {
      // silent
    } finally {
      setSubmitting(false)
    }
  }

  // Step completion
  const completedSteps: number[] = []
  if (existingIdentity?.entity?.first_name) completedSteps.push(1)
  if (existingIdentity?.entity?.business_name) completedSteps.push(2)
  if (bankAccounts.length > 0) completedSteps.push(3)
  if (Object.keys(uploadedDocs).length > 0 || latestVerification) completedSteps.push(4)

  const verificationState = latestVerification?.state || null

  const getStatusBanner = () => {
    if (loadingIdentities || loadingVerifications) {
      return { icon: RefreshCw, color: "text-zinc-400", bg: "bg-zinc-400/5", border: "border-zinc-400/20", title: "Loading...", desc: "Checking your verification status..." }
    }
    if (!existingIdentity) {
      return { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-400/5", border: "border-amber-400/20", title: "Verification Not Started", desc: "Complete all steps below to get verified and start receiving payouts." }
    }
    if (verificationState === "SUCCEEDED") {
      return { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/5", border: "border-emerald-400/20", title: "Verified", desc: "Your account is verified. You can now receive payouts." }
    }
    if (verificationState === "FAILED") {
      return { icon: XCircle, color: "text-red-400", bg: "bg-red-400/5", border: "border-red-400/20", title: "Verification Failed", desc: "Please review your information and resubmit." }
    }
    if (verificationState === "PENDING") {
      return { icon: Clock, color: "text-amber-400", bg: "bg-amber-400/5", border: "border-amber-400/20", title: "Under Review", desc: "Your verification is being reviewed. This usually takes 1-3 business days." }
    }
    return { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-400/5", border: "border-amber-400/20", title: "Verification Required", desc: "Complete all steps below and submit for verification." }
  }

  const banner = getStatusBanner()

  const inputClass = "w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
  const labelClass = "text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block"

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <div className={`${banner.bg} border ${banner.border} rounded-2xl p-5 flex items-start gap-4`}>
        <div className={`${banner.bg} p-2.5 rounded-xl shrink-0`}>
          <banner.icon size={20} className={`${banner.color} ${loadingIdentities ? "animate-spin" : ""}`} />
        </div>
        <div className="flex-1">
          <p className={`text-sm font-black ${banner.color}`}>{banner.title}</p>
          <p className="text-xs text-zinc-500 mt-1">{banner.desc}</p>
        </div>
        {activeIdentityId && (
          <button onClick={() => { mutateIdentities(); mutateVerifications() }} className="p-2 hover:bg-zinc-800/50 rounded-lg transition-colors shrink-0">
            <RefreshCw size={14} className="text-zinc-500" />
          </button>
        )}
      </div>

      {/* Verification History */}
      {verifications.length > 0 && (
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-5">
          <h3 className="text-xs font-black text-white uppercase tracking-wide mb-3">Verification History</h3>
          <div className="space-y-2">
            {verifications.map((v) => {
              const stateColor = v.state === "SUCCEEDED" ? "text-emerald-400" : v.state === "FAILED" ? "text-red-400" : "text-amber-400"
              const stateBg = v.state === "SUCCEEDED" ? "bg-emerald-400/10" : v.state === "FAILED" ? "bg-red-400/10" : "bg-amber-400/10"
              return (
                <div key={v.id} className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${stateBg} ${stateColor}`}>
                      {v.state}
                    </span>
                    <span className="text-[10px] text-zinc-500">{new Date(v.created_at).toLocaleDateString()}</span>
                  </div>
                  {v.messages && v.messages.length > 0 && (
                    <span className="text-[10px] text-zinc-600 truncate max-w-[200px]">{v.messages[0]}</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Steps Progress */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STEPS.map((step) => {
          const done = completedSteps.includes(step.id)
          const active = currentStep === step.id
          return (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`relative bg-zinc-900/40 border rounded-2xl p-5 text-left transition-all duration-200 ${
                active ? "border-emerald-500/40 bg-emerald-500/5" : done ? "border-emerald-500/20" : "border-zinc-800/50 hover:border-zinc-700/50"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl ${done || active ? "bg-emerald-400/10" : "bg-zinc-800/60"}`}>
                  <step.icon size={16} className={done || active ? "text-emerald-400" : "text-zinc-600"} />
                </div>
                {done ? (
                  <CheckCircle2 size={16} className="text-emerald-400" />
                ) : (
                  <span className="text-[10px] font-black text-zinc-600">Step {step.id}</span>
                )}
              </div>
              <p className={`text-xs font-bold ${active || done ? "text-white" : "text-zinc-500"}`}>{step.label}</p>
              <p className="text-[10px] text-zinc-600 mt-0.5">{step.description}</p>
            </button>
          )
        })}
      </div>

      {/* Step Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6">

            {/* STEP 1 - Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wide mb-1">Personal Information</h3>
                  <p className="text-[11px] text-zinc-600">We need this to verify your identity and comply with regulations.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "First Name", value: firstName, onChange: setFirstName, placeholder: "John" },
                    { label: "Last Name", value: lastName, onChange: setLastName, placeholder: "Doe" },
                    { label: "Email", value: email, onChange: setEmail, placeholder: "you@email.com" },
                    { label: "Phone", value: phone, onChange: setPhone, placeholder: "1234567890" },
                    { label: "Country (2-letter)", value: country, onChange: setCountry, placeholder: "US" },
                    { label: "City", value: city, onChange: setCity, placeholder: "Your city" },
                    { label: "Address Line 1", value: addressLine1, onChange: setAddressLine1, placeholder: "123 Main St" },
                    { label: "Region / State", value: region, onChange: setRegion, placeholder: "CA" },
                    { label: "Postal Code", value: postalCode, onChange: setPostalCode, placeholder: "94105" },
                  ].map((f) => (
                    <div key={f.label}>
                      <label className={labelClass}>{f.label}</label>
                      <input type="text" value={f.value} onChange={(e) => f.onChange(e.target.value)} placeholder={f.placeholder} className={inputClass} />
                    </div>
                  ))}
                </div>
                <div>
                  <label className={labelClass}>Date of Birth</label>
                  <div className="grid grid-cols-3 gap-3">
                    <input type="text" value={dobMonth} onChange={(e) => setDobMonth(e.target.value)} placeholder="MM" className={inputClass} />
                    <input type="text" value={dobDay} onChange={(e) => setDobDay(e.target.value)} placeholder="DD" className={inputClass} />
                    <input type="text" value={dobYear} onChange={(e) => setDobYear(e.target.value)} placeholder="YYYY" className={inputClass} />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 - Business Info */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wide mb-1">Business Information</h3>
                  <p className="text-[11px] text-zinc-600">Required for payment processing and compliance.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Business Name", value: businessName, onChange: setBusinessName, placeholder: "Your brand name" },
                    { label: "Doing Business As", value: doingBusinessAs, onChange: setDoingBusinessAs, placeholder: "Display name" },
                    { label: "Website URL", value: businessUrl, onChange: setBusinessUrl, placeholder: "https://..." },
                    { label: "Tax ID / EIN", value: taxId, onChange: setTaxId, placeholder: "123456789" },
                    { label: "Industry Code (MCC)", value: mcc, onChange: setMcc, placeholder: "5734" },
                    { label: "Business Address", value: bizLine1, onChange: setBizLine1, placeholder: "Street address" },
                    { label: "Business City", value: bizCity, onChange: setBizCity, placeholder: "City" },
                    { label: "Business Region", value: bizRegion, onChange: setBizRegion, placeholder: "State" },
                    { label: "Business Postal Code", value: bizPostal, onChange: setBizPostal, placeholder: "Postal code" },
                  ].map((f) => (
                    <div key={f.label}>
                      <label className={labelClass}>{f.label}</label>
                      <input type="text" value={f.value} onChange={(e) => f.onChange(e.target.value)} placeholder={f.placeholder} className={inputClass} />
                    </div>
                  ))}
                </div>
                <div>
                  <label className={labelClass}>Business Type</label>
                  <select value={businessType} onChange={(e) => setBusinessType(e.target.value)} className={inputClass}>
                    <option value="INDIVIDUAL_SOLE_PROPRIETORSHIP">Individual / Sole Proprietorship</option>
                    <option value="CORPORATION">Corporation</option>
                    <option value="LIMITED_LIABILITY_COMPANY">LLC</option>
                    <option value="PARTNERSHIP">Partnership</option>
                    <option value="ASSOCIATION_ESTATE_TRUST">Association / Estate / Trust</option>
                    <option value="TAX_EXEMPT_ORGANIZATION">Tax Exempt Organization</option>
                    <option value="INTERNATIONAL_ORGANIZATION">International Organization</option>
                    <option value="GOVERNMENT_AGENCY">Government Agency</option>
                  </select>
                </div>
              </div>
            )}

            {/* STEP 3 - Bank Account */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wide mb-1">Bank Account</h3>
                  <p className="text-[11px] text-zinc-600">Add your bank account to receive payouts. Your information is encrypted and stored securely.</p>
                </div>

                {/* Current Connected Bank Account */}
                <div className="bg-zinc-800/20 border border-zinc-700/30 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black text-white uppercase tracking-wide">Current Bank Account</p>
                    {bankAccounts.length > 0 && (
                      <span className="text-[9px] font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-lg uppercase border border-emerald-400/20">Connected</span>
                    )}
                  </div>

                  {bankAccounts.length > 0 ? (
                    <div className="space-y-2.5">
                      {bankAccounts.map((ba) => (
                        <div key={ba.id} className="flex items-center justify-between bg-zinc-900/40 border border-zinc-700/20 rounded-xl p-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-emerald-400/10 p-3 rounded-xl">
                              <Landmark size={18} className="text-emerald-400" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white">{ba.name || "Bank Account"}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-[10px] text-zinc-500">
                                  {ba.account_type ? ba.account_type.charAt(0) + ba.account_type.slice(1).toLowerCase() : "Account"}
                                </p>
                                {ba.masked_account_number && (
                                  <>
                                    <span className="text-zinc-700">&#183;</span>
                                    <p className="text-[10px] text-zinc-400 font-mono">
                                      {"****"} {ba.masked_account_number}
                                    </p>
                                  </>
                                )}
                                {ba.bank_code && (
                                  <>
                                    <span className="text-zinc-700">&#183;</span>
                                    <p className="text-[10px] text-zinc-500">Routing: {ba.bank_code}</p>
                                  </>
                                )}
                              </div>
                              {ba.currency && (
                                <p className="text-[10px] text-zinc-600 mt-0.5">{ba.currency} {ba.country ? `- ${ba.country}` : ""}</p>
                              )}
                            </div>
                          </div>
                          <button onClick={() => handleRemoveBankAccount(ba.id)} className="p-2.5 hover:bg-red-500/10 rounded-xl transition-colors group" title="Remove account">
                            <Trash2 size={14} className="text-zinc-600 group-hover:text-red-400 transition-colors" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 p-4 bg-zinc-900/30 border border-dashed border-zinc-700/40 rounded-xl">
                      <div className="bg-zinc-800/60 p-3 rounded-xl">
                        <Landmark size={18} className="text-zinc-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-zinc-500">No bank account connected</p>
                        <p className="text-[10px] text-zinc-600 mt-0.5">Add a bank account below to receive payouts.</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Add new bank account form */}
                <div className="bg-zinc-800/20 border border-zinc-700/30 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Plus size={14} className="text-emerald-400" />
                    <p className="text-xs font-black text-white">Add New Bank Account</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Account Holder Name</label>
                      <input type="text" value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="John Doe" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Bank Name (optional)</label>
                      <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="e.g. Chase, Wells Fargo" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Routing Number</label>
                      <input type="text" value={routingNumber} onChange={(e) => setRoutingNumber(e.target.value)} placeholder="9 digit routing number" maxLength={9} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Account Number</label>
                      <div className="relative">
                        <input
                          type={showAccountNum ? "text" : "password"}
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          placeholder="Account number"
                          className={inputClass + " pr-10"}
                        />
                        <button type="button" onClick={() => setShowAccountNum(!showAccountNum)} className="absolute right-3 top-1/2 -translate-y-1/2">
                          {showAccountNum ? <EyeOff size={14} className="text-zinc-500" /> : <Eye size={14} className="text-zinc-500" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Account Type</label>
                    <div className="flex gap-3">
                      {["SAVINGS", "CHECKING"].map((type) => (
                        <button
                          key={type}
                          onClick={() => setAccountType(type)}
                          className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                            accountType === type
                              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                              : "bg-zinc-800/50 border-zinc-700/50 text-zinc-500 hover:border-zinc-600/50"
                          }`}
                        >
                          {type.charAt(0) + type.slice(1).toLowerCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-amber-400/5 border border-amber-400/15 rounded-xl">
                    <Info size={14} className="text-amber-400 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-amber-400/80">Your bank details are transmitted securely using encryption. We never store your full account number.</p>
                  </div>

                  <button
                    onClick={handleAddBankAccount}
                    disabled={addingBank || !accountNumber || !routingNumber}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-black rounded-xl text-xs font-black hover:bg-emerald-400 transition-colors disabled:opacity-50"
                  >
                    {addingBank && <Loader2 size={14} className="animate-spin" />}
                    {addingBank ? "Adding..." : "Add Bank Account"}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4 - Documents */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wide mb-1">Documents</h3>
                  <p className="text-[11px] text-zinc-600">Upload the required documents to complete your verification. Accepted formats: PDF, JPG, PNG (max 10MB).</p>
                </div>

                <div className="space-y-4">
                  {DOCUMENT_TYPES.map((doc) => {
                    const uploaded = uploadedDocs[doc.key]
                    const isUploading = uploadingDoc === doc.key

                    return (
                      <div key={doc.key} className={`border rounded-2xl p-5 transition-all ${
                        uploaded ? "bg-emerald-500/5 border-emerald-500/20" : "bg-zinc-800/20 border-zinc-700/30"
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={`p-2.5 rounded-xl shrink-0 ${uploaded ? "bg-emerald-400/10" : "bg-zinc-800/60"}`}>
                              {uploaded ? <CheckCircle2 size={16} className="text-emerald-400" /> : <FileText size={16} className="text-zinc-500" />}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white">{doc.label}</p>
                              <p className="text-[10px] text-zinc-500 mt-0.5">{doc.desc}</p>
                              {uploaded && (
                                <p className="text-[10px] text-emerald-400/80 mt-1.5 flex items-center gap-1">
                                  <CheckCircle2 size={10} /> Uploaded: {uploaded.name}
                                </p>
                              )}
                            </div>
                          </div>

                          <label className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black cursor-pointer transition-all shrink-0 ${
                            isUploading
                              ? "bg-zinc-800/50 text-zinc-500"
                              : uploaded
                                ? "bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 hover:text-white"
                                : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                          }`}>
                            {isUploading ? (
                              <><Loader2 size={12} className="animate-spin" /> Uploading...</>
                            ) : uploaded ? (
                              <><Upload size={12} /> Replace</>
                            ) : (
                              <><Upload size={12} /> Upload</>
                            )}
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              disabled={isUploading}
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleDocumentUpload(doc.key, file)
                                e.target.value = ""
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Summary before submit */}
                <div className="bg-zinc-800/30 rounded-2xl p-5 space-y-3 mt-6">
                  <p className={labelClass}>Verification Summary</p>
                  {[
                    { label: "Name", value: `${firstName} ${lastName}` },
                    { label: "Email", value: email },
                    { label: "Business", value: businessName || doingBusinessAs || "---" },
                    { label: "Type", value: businessType.replace(/_/g, " ") },
                    { label: "Bank Accounts", value: `${bankAccounts.length} connected` },
                    { label: "Documents", value: `${Object.keys(uploadedDocs).length} of ${DOCUMENT_TYPES.length} uploaded` },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{row.label}</span>
                      <span className="text-xs text-zinc-300">{row.value}</span>
                    </div>
                  ))}
                </div>

                {latestVerification && (
                  <div className={`p-4 rounded-xl border ${
                    latestVerification.state === "SUCCEEDED" ? "bg-emerald-400/5 border-emerald-500/20" :
                    latestVerification.state === "FAILED" ? "bg-red-400/5 border-red-500/20" :
                    "bg-amber-400/5 border-amber-400/20"
                  }`}>
                    <p className="text-xs font-bold text-white mb-1">
                      {"Last Review: "}
                      <span className={
                        latestVerification.state === "SUCCEEDED" ? "text-emerald-400" :
                        latestVerification.state === "FAILED" ? "text-red-400" : "text-amber-400"
                      }>{latestVerification.state === "SUCCEEDED" ? "Approved" : latestVerification.state === "FAILED" ? "Rejected" : "Pending"}</span>
                    </p>
                    {latestVerification.messages && latestVerification.messages.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {latestVerification.messages.map((msg: string, i: number) => (
                          <p key={i} className="text-[10px] text-amber-400/80">{msg}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex items-center justify-between mt-8 pt-5 border-t border-zinc-800/50">
              <button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="px-6 py-2.5 bg-zinc-800 text-zinc-400 rounded-xl text-xs font-bold border border-zinc-700/50 disabled:opacity-30 hover:text-white transition-colors"
              >
                Back
              </button>
              {currentStep === 4 ? (
                <button
                  onClick={handleSubmitVerification}
                  disabled={submitting || !firstName || !lastName}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-black rounded-xl text-xs font-black hover:bg-emerald-400 transition-colors disabled:opacity-50"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  {submitting ? "Submitting..." : "Submit for Verification"}
                </button>
              ) : (
                <button
                  onClick={handleSaveStep}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-black rounded-xl text-xs font-black hover:bg-emerald-400 transition-colors disabled:opacity-50"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {saving ? "Saving..." : "Save & Continue"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-400/10 p-2 rounded-xl">
                <ShieldCheck size={18} className="text-emerald-400" />
              </div>
              <h3 className="text-xs font-black text-white uppercase tracking-wide">Account Verification</h3>
            </div>
            <ul className="space-y-3">
              {[
                "Verifies your identity for compliance",
                "Enables payment processing on your account",
                "Connects your bank for payouts",
                "Usually reviewed within 1-3 business days",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-zinc-400">
                  <CheckCircle2 size={12} className="text-emerald-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Completion Checklist */}
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6">
            <h3 className="text-xs font-black text-white uppercase tracking-wide mb-3">Checklist</h3>
            <div className="space-y-2.5">
              {STEPS.map((step) => {
                const done = completedSteps.includes(step.id)
                return (
                  <div key={step.id} className="flex items-center gap-2.5">
                    {done ? (
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-zinc-700 shrink-0" />
                    )}
                    <span className={`text-[11px] ${done ? "text-zinc-300 line-through" : "text-zinc-500"}`}>{step.label}</span>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/50">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-zinc-600 font-bold">Progress</span>
                <span className="text-emerald-400 font-black">{completedSteps.length}/4 complete</span>
              </div>
              <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${(completedSteps.length / 4) * 100}%` }} />
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6">
            <h3 className="text-xs font-black text-white uppercase tracking-wide mb-3">Need Help?</h3>
            <p className="text-[11px] text-zinc-500 mb-4">Having trouble with verification? Our support team is here to help.</p>
            <button className="block w-full py-2.5 bg-zinc-800 text-zinc-300 rounded-xl text-xs font-bold border border-zinc-700/50 hover:text-white transition-colors text-center">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
