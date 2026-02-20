import { NextRequest, NextResponse } from "next/server"
import { createFile, listFiles } from "@/lib/finix"

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams
    const params: Record<string, string> = {}
    sp.forEach((v, k) => { params[k] = v })
    const data = await listFiles(params)
    return NextResponse.json(data)
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = await createFile(body.display_name, body.tags)
    return NextResponse.json(data)
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
