import { NextResponse } from "next/server";

// Lightweight health-check endpoint for embedders to verify the widget script/API
// is reachable before mounting <CallWidget /> on a third-party page.
export async function GET() {
  return NextResponse.json({ success: true, message: "EstateCall widget endpoint is reachable" });
}
