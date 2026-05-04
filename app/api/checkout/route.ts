import { NextRequest, NextResponse } from "next/server"
import { createIdentity, createPaymentInstrument, createTransfer } from "@/lib/finix"
import clientPromise from "@/lib/mongodb"
import { sendEmail } from "@/lib/email"
import { orderConfirmationEmail, newSaleNotificationEmail } from "@/lib/email-templates"

const DB = process.env.MONGODB_DB || "lynkpay"

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

    // Persist the order to MongoDB
    try {
      const mongo = await clientPromise
      const db = mongo.db(DB)
      await db.collection("orders").insertOne({
        transactionId: transfer.id,
        state: transfer.state,
        amount: transfer.amount,
        currency: transfer.currency || currency || "USD",
        productTitle: productTitle || "Purchase",
        productType: body.productType || "digital",
        productImage: body.productImage || null,
        customer: {
          firstName: customer.firstName,
          lastName: customer.lastName || "",
          email: customer.email,
          phone: customer.phone || "",
        },
        sellerUsername: body.sellerUsername || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    } catch {
      // Order save failed but payment succeeded -- don't fail the response
    }

    // Send transactional emails (fire-and-forget)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lynkpay.co"
    const amountFormatted = (Math.round(amount) / 100).toFixed(2)
    const currencySymbol = currency === "CAD" ? "CA$" : "$"
    const purchaseDate = new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })

    // 1. Order confirmation to buyer
    const buyerEmail = orderConfirmationEmail({
      customerName: customer.firstName,
      orderId: transfer.id,
      productTitle: productTitle || "Purchase",
      productType: body.productType || "Digital Product",
      amount: amountFormatted,
      currency: currencySymbol,
      sellerName: body.sellerUsername || "Seller",
      sellerUsername: body.sellerUsername || "",
      purchaseDate,
    })
    sendEmail({ to: customer.email, subject: buyerEmail.subject, html: buyerEmail.html }).catch(() => {})

    // 2. Sale notification to seller (if seller exists)
    if (body.sellerUsername) {
      try {
        const mongo = await clientPromise
        const db = mongo.db(DB)
        const seller = await db.collection("users").findOne(
          { username: body.sellerUsername },
          { projection: { email: 1, firstName: 1 } },
        )
        if (seller?.email) {
          const sellerEmail = newSaleNotificationEmail({
            sellerName: seller.firstName || body.sellerUsername,
            productTitle: productTitle || "Purchase",
            amount: amountFormatted,
            currency: currencySymbol,
            customerEmail: customer.email,
            orderId: transfer.id,
            saleDate: purchaseDate,
            dashboardUrl: `${baseUrl}/dashboard`,
          })
          sendEmail({ to: seller.email, subject: sellerEmail.subject, html: sellerEmail.html }).catch(() => {})
        }
      } catch {
        // Seller lookup failed, skip notification
      }
    }

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
