import { NextRequest, NextResponse } from "next/server"
import { listIdentities, createIdentity } from "@/lib/finix"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const params: Record<string, string> = {}

    searchParams.forEach((value, key) => {
      params[key] = value
    })

    const data = await listIdentities(Object.keys(params).length > 0 ? params : undefined)
    return NextResponse.json(data)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch identities"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = await createIdentity(body)
    return NextResponse.json(data)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create identity"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
