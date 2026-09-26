import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.institutionName || !body.contactEmail) {
      return NextResponse.json(
        { success: false, error: "Institution Name and Contact Email are required." },
        { status: 400 }
      );
    }
    const created = await dbService.addInquiry(body);
    return NextResponse.json({ success: true, inquiry: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
