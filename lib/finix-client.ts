// Finix API Client
// Documentation: https://docs.finix.com/api

const FINIX_BASE_URL = process.env.NEXT_PUBLIC_FINIX_BASE_URL || 'https://finix.sandbox-payments-api.com'
const FINIX_USERNAME = process.env.FINIX_USERNAME || 'USsRhsHYZGBPnQw8CByJyEQW'
const FINIX_PASSWORD = process.env.FINIX_PASSWORD || '8a14c2f9-d94b-4c72-8f5c-a62908e5b30e'
const FINIX_VERSION = '2022-02-01'

// Base64 encode credentials for Basic Auth
const authHeader = typeof window === 'undefined' 
  ? `Basic ${Buffer.from(`${FINIX_USERNAME}:${FINIX_PASSWORD}`).toString('base64')}`
  : `Basic ${btoa(`${FINIX_USERNAME}:${FINIX_PASSWORD}`)}`

export interface FinixError {
  message: string
  status: number
  code?: string
}

async function finixRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${FINIX_BASE_URL}${endpoint}`
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Finix-Version': FINIX_VERSION,
      'Authorization': authHeader,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error: FinixError = {
      message: `Finix API Error: ${response.statusText}`,
      status: response.status,
    }
    
    try {
      const errorData = await response.json()
      error.message = errorData.message || error.message
      error.code = errorData.code
    } catch {}
    
    throw error
  }

  return response.json()
}

// Transfers (Transactions) API
export interface Transfer {
  id: string
  created_at: string
  updated_at: string
  amount: number
  currency: string
  state: 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'CANCELED'
  type: 'DEBIT' | 'CREDIT' | 'REVERSAL' | 'REFUND'
  merchant: string
  source: string
  destination: string
  tags?: Record<string, string>
  trace_id?: string
  raw_trace_id?: string
  ready_to_settle_at?: string
  messages?: string[]
}

export interface ListTransfersResponse {
  _embedded: {
    transfers: Transfer[]
  }
  page: {
    offset: number
    limit: number
    count: number
  }
}

export async function listTransfers(params?: {
  limit?: number
  offset?: number
  created_at_gte?: string
  created_at_lte?: string
  type?: string
  state?: string
}): Promise<ListTransfersResponse> {
  const queryString = new URLSearchParams(params as any).toString()
  return finixRequest<ListTransfersResponse>(`/transfers?${queryString}`)
}

export async function getTransfer(transferId: string): Promise<Transfer> {
  return finixRequest<Transfer>(`/transfers/${transferId}`)
}

// Disputes API
export interface Dispute {
  id: string
  created_at: string
  updated_at: string
  action: string
  amount: number
  currency: string
  dispute_reason: string
  dispute_state: 'INQUIRY' | 'PENDING' | 'WON' | 'LOST' | 'ARBITRATION'
  reason_code: string
  reason_message: string
  respond_by: string
  transfer: string
  tags?: Record<string, string>
}

export interface ListDisputesResponse {
  _embedded: {
    disputes: Dispute[]
  }
  page: {
    offset: number
    limit: number
    count: number
  }
}

export async function listDisputes(params?: {
  limit?: number
  offset?: number
  created_at_gte?: string
  created_at_lte?: string
}): Promise<ListDisputesResponse> {
  const queryString = new URLSearchParams(params as any).toString()
  return finixRequest<ListDisputesResponse>(`/disputes?${queryString}`)
}

export async function getDispute(disputeId: string): Promise<Dispute> {
  return finixRequest<Dispute>(`/disputes/${disputeId}`)
}

export async function updateDispute(disputeId: string, data: { tags?: Record<string, string> }): Promise<Dispute> {
  return finixRequest<Dispute>(`/disputes/${disputeId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// Settlements (Reports) API
export interface Settlement {
  id: string
  created_at: string
  updated_at: string
  currency: string
  destination: string
  merchant: string
  net_amount: number
  processor: string
  status: 'PENDING' | 'APPROVED' | 'FUNDED' | 'FAILED'
  total_amount: number
  total_fee: number
  total_fees: number
  tags?: Record<string, string>
}

export interface ListSettlementsResponse {
  _embedded: {
    settlements: Settlement[]
  }
  page: {
    offset: number
    limit: number
    count: number
  }
}

export async function listSettlements(params?: {
  limit?: number
  offset?: number
  created_at_gte?: string
  created_at_lte?: string
}): Promise<ListSettlementsResponse> {
  const queryString = new URLSearchParams(params as any).toString()
  return finixRequest<ListSettlementsResponse>(`/settlements?${queryString}`)
}

export async function getSettlement(settlementId: string): Promise<Settlement> {
  return finixRequest<Settlement>(`/settlements/${settlementId}`)
}

// Verifications API
export interface Verification {
  id: string
  created_at: string
  updated_at: string
  identity: string
  merchant?: string
  processor: string
  state: 'PENDING' | 'SUCCEEDED' | 'FAILED'
  tags?: Record<string, string>
  messages?: Array<{
    field?: string
    message: string
    code?: string
  }>
}

export interface ListVerificationsResponse {
  _embedded: {
    verifications: Verification[]
  }
  page: {
    offset: number
    limit: number
    count: number
  }
}

export async function createVerification(identityId: string, data: {
  processor?: string
  tags?: Record<string, string>
}): Promise<Verification> {
  return finixRequest<Verification>(`/identities/${identityId}/verifications`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// Identity API
export interface Identity {
  id: string
  created_at: string
  updated_at: string
  entity: {
    first_name?: string
    last_name?: string
    title?: string
    email?: string
    phone?: string
    business_name?: string
    business_type?: string
    doing_business_as?: string
    business_phone?: string
    business_address?: {
      line1?: string
      line2?: string
      city?: string
      region?: string
      postal_code?: string
      country?: string
    }
    personal_address?: {
      line1?: string
      line2?: string
      city?: string
      region?: string
      postal_code?: string
      country?: string
    }
    dob?: {
      day?: number
      month?: number
      year?: number
    }
    tax_id?: string
  }
  tags?: Record<string, string>
}

export async function createIdentity(data: Partial<Identity>): Promise<Identity> {
  return finixRequest<Identity>('/identities', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getIdentity(identityId: string): Promise<Identity> {
  return finixRequest<Identity>(`/identities/${identityId}`)
}

export async function updateIdentity(identityId: string, data: Partial<Identity>): Promise<Identity> {
  return finixRequest<Identity>(`/identities/${identityId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}
