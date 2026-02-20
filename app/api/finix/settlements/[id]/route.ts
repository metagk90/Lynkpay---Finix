import { NextRequest, NextResponse } from "next/server"
import { getSettlement, getSettlementTransfers } from "@/lib/finix"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const includeTransfers = req.nextUrl.searchParams.get("include_transfers") === "true"

    const settlement = await getSettlement(id)

    if (includeTransfers) {
      const transfers = await getSettlementTransfers(id)
      return NextResponse.json({ ...settlement, settlement_transfers: transfers })
    }

    return NextResponse.json(settlement)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch settlement"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
