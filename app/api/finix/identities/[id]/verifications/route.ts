import { NextRequest, NextResponse } from "next/server"
import { listVerifications, createVerification } from "@/lib/finix"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await listVerifications(id)
    return NextResponse.json(data)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch verifications"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await createVerification(id)
    return NextResponse.json(data)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create verification"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
