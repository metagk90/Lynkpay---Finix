import { NextRequest, NextResponse } from "next/server"
import { uploadDisputeEvidence } from "@/lib/finix"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const data = await uploadDisputeEvidence(id, buffer, file.name)
    return NextResponse.json(data)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to upload evidence"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
