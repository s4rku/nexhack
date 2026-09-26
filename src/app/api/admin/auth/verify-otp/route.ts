import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: "Email and OTP are both required." },
        { status: 400 }
      );
    }

    const verification = await dbService.verifyOtp(email, otp);

    if (!verification.success) {
      return NextResponse.json(
        { success: false, error: verification.error || "Verification failed." },
        { status: 400 }
      );
    }

    // Generate secure session token
    const sessionToken = `nexhack_sess_${Date.now()}_${Math.random().toString(36).substring(2)}`;

    return NextResponse.json({
      success: true,
      token: sessionToken,
      email: email.toLowerCase().trim(),
      message: "Authentication successful! Welcome to the NEXHACK Admin Console.",
    });
  } catch (error: any) {
    console.error("verify-otp error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to verify OTP." },
      { status: 500 }
    );
  }
}
