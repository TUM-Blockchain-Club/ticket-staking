import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    address: process.env.SMART_CONTRACT_ADDRESS!,
    amount: process.env.STAKE_AMOUNT!
  })
}
