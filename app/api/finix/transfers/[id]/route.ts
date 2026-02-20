import { NextRequest, NextResponse } from "next/server"
import { getTransfer } from "@/lib/finix"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await getTransfer(id)
    return NextResponse.json(data)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch transfer"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
