import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbService } from "@/lib/mongodb";

// GET /api/user/registrations — all registrations for the signed-in user's email
export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const all = await dbService.getRegistrations();
    const mine = all.filter(
      (r) => r.email.toLowerCase() === session.user!.email!.toLowerCase()
    );
    return NextResponse.json({ success: true, registrations: mine });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
