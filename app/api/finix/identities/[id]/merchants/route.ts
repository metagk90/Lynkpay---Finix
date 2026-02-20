import { NextRequest, NextResponse } from "next/server"
import { listMerchants, createMerchant } from "@/lib/finix"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await listMerchants(id)
    return NextResponse.json(data)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch merchants"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const data = await createMerchant(id, body)
    return NextResponse.json(data)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create merchant"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
