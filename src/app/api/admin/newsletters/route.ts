import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/mongodb";

export async function GET() {
  try {
    const newsletters = await dbService.getNewsletters();
    return NextResponse.json({ success: true, newsletters });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing subscriber id or email" }, { status: 400 });
    }
    const deleted = await dbService.deleteNewsletter(id);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

