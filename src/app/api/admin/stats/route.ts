import { NextResponse } from "next/server";
import { dbService } from "@/lib/mongodb";

export async function GET() {
  try {
    const stats = await dbService.getDashboardStats();
    return NextResponse.json({ success: true, stats });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
