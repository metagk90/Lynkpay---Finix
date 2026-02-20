import { NextRequest, NextResponse } from "next/server"
import { finixUploadFileRaw } from "@/lib/finix"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const formData = await req.formData()
    const file = formData.get("file") as File
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const data = await finixUploadFileRaw(id, buffer, file.name)
    return NextResponse.json(data)
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
