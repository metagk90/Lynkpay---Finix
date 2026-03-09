import { NextRequest, NextResponse } from "next/server"
import { createIdentity, createPaymentInstrument, createTransfer } from "@/lib/finix"

/**
 * Checkout API - White-label payment processing
 * 
 * Flow:
 * 1. Create a buyer Identity with customer info
 * 2. Create a Payment Instrument (card) linked to that identity
 * 3. Create a Transfer (debit) to charge the card
 */

const MERCHANT_ID = process.env.FINIX_MERCHANT_ID || ""

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      amount,       // in cents
      currency,
      productTitle,
      customer,     // { firstName, lastName, email, phone }
      card,         // { number, expirationMonth, expirationYear, securityCode }
    } = body

    if (!amount || !card?.number || !customer?.firstName || !customer?.email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!MERCHANT_ID) {
      return NextResponse.json({ error: "Payment processing not configured. FINIX_MERCHANT_ID is missing." }, { status: 500 })
    }

    // Step 1: Create buyer identity
    // Finix requires entity fields for identity creation
    const identity = await createIdentity({
      entity: {
        type: "PERSONAL",
        first_name: customer.firstName,
        last_name: customer.lastName || customer.firstName,
        email: customer.email,
        phone: customer.phone || "1234567890",
      },
    })

    // Step 2: Create payment instrument (card)
    // Finix requires: identity, type, number, expiration_month, expiration_year, security_code, address
    const expMonth = parseInt(card.expirationMonth)
    const expYear = parseInt(card.expirationYear)
    // Finix expects 4-digit year
    const fullYear = expYear < 100 ? 2000 + expYear : expYear

    const paymentInstrument = await createPaymentInstrument({
      identity: identity.id,
      type: "PAYMENT_CARD",
      number: card.number.replace(/\s/g, ""),
      expiration_month: expMonth,
      expiration_year: fullYear,
      security_code: card.securityCode,
      name: `${customer.firstName} ${customer.lastName || ""}`.trim(),
      // Address is required by Finix for card payment instruments
      address: {
        line1: "123 Main St",
        city: "San Francisco",
        region: "CA",
        postal_code: "94105",
        country: "US",
      },
    })

    // Step 3: Create transfer (charge)
    // amount must be in cents (integer), currency uppercase
    const transfer = await createTransfer({
      merchant: MERCHANT_ID,
      source: paymentInstrument.id,
      amount: Math.round(amount),
      currency: (currency === "CAD" ? "CAD" : "USD"),
      tags: {
        product: productTitle || "Purchase",
        order_type: "lynkpay_checkout",
      },
    })

    return NextResponse.json({
      success: true,
      transactionId: transfer.id,
      state: transfer.state,
      amount: transfer.amount,
      currency: transfer.currency,
      created: transfer.created_at,
    })
  } catch (error: unknown) {
    const rawMessage = error instanceof Error ? error.message : "Checkout failed"

    // Try to extract the Finix error body for a user-friendly message
    let userMessage = "Payment could not be processed. Please try again."
    try {
      // The error message format is: "Finix API error: 422 Unprocessable Entity | { JSON body }"
      const jsonMatch = rawMessage.match(/\|\s*(\{.+\})\s*$/s)
      if (jsonMatch) {
        const finixError = JSON.parse(jsonMatch[1])
        if (finixError._embedded?.errors?.[0]?.message) {
          userMessage = finixError._embedded.errors[0].message
        } else if (finixError.message) {
          userMessage = finixError.message
        }
      } else if (rawMessage.includes("422")) {
        userMessage = "Invalid payment details. Please check your card information and try again."
      } else if (rawMessage.includes("MERCHANT_ID")) {
        userMessage = rawMessage
      }
    } catch {
      // parsing failed, use default
    }

    return NextResponse.json({ error: userMessage }, { status: 500 })
  }
}
