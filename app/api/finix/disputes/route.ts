import { NextRequest, NextResponse } from "next/server"
import { listDisputes } from "@/lib/finix"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const params: Record<string, string> = {}

    searchParams.forEach((value, key) => {
      params[key] = value
    })

    const data = await listDisputes(Object.keys(params).length > 0 ? params : undefined)
    return NextResponse.json(data)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch disputes"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
