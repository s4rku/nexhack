import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.email || !body.email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }
    const created = await dbService.addNewsletter(body.email, body.source || "Website");
    return NextResponse.json({ success: true, subscriber: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
