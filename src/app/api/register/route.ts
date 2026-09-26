import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.fullName || !body.email || !body.collegeOrSchool) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required fields (Name, Email, Institution)." },
        { status: 400 }
      );
    }
    const created = await dbService.addRegistration(body);
    return NextResponse.json({ success: true, registration: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
