const FINIX_API_URL = process.env.FINIX_API_URL || "https://finix.sandbox-payments-api.com"
const FINIX_API_USERNAME = process.env.FINIX_API_USERNAME || ""
const FINIX_API_PASSWORD = process.env.FINIX_API_PASSWORD || ""

function getAuthHeader() {
  return "Basic " + Buffer.from(`${FINIX_API_USERNAME}:${FINIX_API_PASSWORD}`).toString("base64")
}

export async function finixFetch(path: string, options: RequestInit = {}) {
  const url = `${FINIX_API_URL}${path}`
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Finix-Version": "2022-02-01",
      Authorization: getAuthHeader(),
      ...options.headers,
    },
  })

  if (!res.ok) {
    const errorBody = await res.text()
    console.error(`[Finix] ${res.status} ${res.statusText} - ${path}`, errorBody)
    throw new Error(`Finix API error: ${res.status} ${res.statusText} | ${errorBody}`)
  }

  return res.json()
}

// --- Transfers (Transactions) ---

export async function listTransfers(params?: Record<string, string>) {
  const query = params ? "?" + new URLSearchParams(params).toString() : ""
  return finixFetch(`/transfers${query}`)
}

export async function getTransfer(id: string) {
  return finixFetch(`/transfers/${id}`)
}

export async function createTransfer(body: Record<string, unknown>) {
  return finixFetch("/transfers", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

// --- Authorizations ---

export async function createAuthorization(body: Record<string, unknown>) {
  return finixFetch("/authorizations", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export async function captureAuthorization(authorizationId: string, body: Record<string, unknown>) {
  return finixFetch(`/authorizations/${authorizationId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  })
}

// --- Disputes ---

export async function listDisputes(params?: Record<string, string>) {
  const query = params ? "?" + new URLSearchParams(params).toString() : ""
  return finixFetch(`/disputes${query}`)
}

export async function getDispute(id: string) {
  return finixFetch(`/disputes/${id}`)
}

export async function uploadDisputeEvidence(disputeId: string, file: Buffer, filename: string) {
  const url = `${FINIX_API_URL}/disputes/${disputeId}/evidence`
  const formData = new FormData()
  formData.append("file", new Blob([file]), filename)

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: getAuthHeader(),
    },
    body: formData,
  })

  if (!res.ok) {
    const errorBody = await res.text()
    throw new Error(`Finix API error: ${res.status} - ${errorBody}`)
  }

  return res.json()
}

// --- Settlements (Reports) ---

export async function listSettlements(params?: Record<string, string>) {
  const query = params ? "?" + new URLSearchParams(params).toString() : ""
  return finixFetch(`/settlements${query}`)
}

export async function getSettlement(id: string) {
  return finixFetch(`/settlements/${id}`)
}

export async function getSettlementTransfers(id: string, params?: Record<string, string>) {
  const query = params ? "?" + new URLSearchParams(params).toString() : ""
  return finixFetch(`/settlements/${id}/transfers${query}`)
}

// --- Identities & Verifications ---

export async function listIdentities(params?: Record<string, string>) {
  const query = params ? "?" + new URLSearchParams(params).toString() : ""
  return finixFetch(`/identities${query}`)
}

export async function getIdentity(id: string) {
  return finixFetch(`/identities/${id}`)
}

export async function createIdentity(body: Record<string, unknown>) {
  return finixFetch("/identities", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export async function updateIdentity(id: string, body: Record<string, unknown>) {
  return finixFetch(`/identities/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  })
}

export async function listVerifications(identityId: string) {
  return finixFetch(`/identities/${identityId}/verifications`)
}

export async function createVerification(identityId: string) {
  return finixFetch(`/identities/${identityId}/verifications`, {
    method: "POST",
    body: JSON.stringify({}),
  })
}

// --- Merchants ---

export async function listMerchants(identityId: string) {
  return finixFetch(`/identities/${identityId}/merchants`)
}

export async function createMerchant(identityId: string, body: Record<string, unknown>) {
  return finixFetch(`/identities/${identityId}/merchants`, {
    method: "POST",
    body: JSON.stringify(body),
  })
}

// --- Payment Instruments (Bank Accounts) ---

export async function listPaymentInstruments(identityId: string, params?: Record<string, string>) {
  const query = params ? "?" + new URLSearchParams(params).toString() : ""
  return finixFetch(`/identities/${identityId}/payment_instruments${query}`)
}

export async function createPaymentInstrument(body: Record<string, unknown>) {
  return finixFetch("/payment_instruments", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export async function getPaymentInstrument(id: string) {
  return finixFetch(`/payment_instruments/${id}`)
}

export async function deletePaymentInstrument(id: string) {
  return finixFetch(`/payment_instruments/${id}`, {
    method: "PUT",
    body: JSON.stringify({ enabled: false }),
  })
}

// --- Files / Document Uploads ---

export async function createFile(displayName: string, tags?: Record<string, string>) {
  return finixFetch("/files", {
    method: "POST",
    body: JSON.stringify({
      display_name: displayName,
      linked_to: "IDENTITY",
      type: "IDENTITY_VERIFICATION",
      ...(tags ? { tags } : {}),
    }),
  })
}

export async function uploadFileExternalLink(fileId: string, externalLink: string) {
  return finixFetch(`/files/${fileId}/external_links`, {
    method: "POST",
    body: JSON.stringify({ type: "IDENTITY_VERIFICATION", url: externalLink }),
  })
}

export async function finixUploadFileRaw(fileId: string, fileBuffer: Buffer, filename: string) {
  const url = `${FINIX_API_URL}/files/${fileId}/upload`
  const formData = new FormData()
  formData.append("file", new Blob([fileBuffer]), filename)

  const res = await fetch(url, {
    method: "PUT",
    headers: { Authorization: getAuthHeader() },
    body: formData,
  })

  if (!res.ok) {
    const errorBody = await res.text()
    throw new Error(`Finix file upload error: ${res.status} - ${errorBody}`)
  }

  // Some file uploads return 204 No Content
  if (res.status === 204) return { success: true }
  return res.json()
}

export async function listFiles(params?: Record<string, string>) {
  const query = params ? "?" + new URLSearchParams(params).toString() : ""
  return finixFetch(`/files${query}`)
}
