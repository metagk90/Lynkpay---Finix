import { NextRequest, NextResponse } from "next/server"
import { listPaymentInstruments, createPaymentInstrument } from "@/lib/finix"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await listPaymentInstruments(id)
    return NextResponse.json(data)
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const data = await createPaymentInstrument({ ...body, identity: id })
    return NextResponse.json(data)
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
