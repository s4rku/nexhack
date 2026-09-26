import { NextResponse } from "next/server";
import { dbService } from "@/lib/mongodb";

export async function GET() {
  try {
    const events = await dbService.getEvents();
    return NextResponse.json({ success: true, events });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
