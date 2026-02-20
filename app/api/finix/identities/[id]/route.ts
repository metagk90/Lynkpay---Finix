import { NextRequest, NextResponse } from "next/server"
import { getIdentity, updateIdentity } from "@/lib/finix"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await getIdentity(id)
    return NextResponse.json(data)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch identity"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const data = await updateIdentity(id, body)
    return NextResponse.json(data)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update identity"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
