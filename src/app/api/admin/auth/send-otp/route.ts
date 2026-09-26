import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/mongodb";
import { sendOtpEmail, isSmtpConfigured } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, passcode } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid admin email address." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const configuredSecret = process.env.ADMIN_SECRET_KEY || "nexhack_admin_2026";
    const configuredAdminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();

    // If an ADMIN_EMAIL is explicitly configured, ensure the email matches
    if (configuredAdminEmail && cleanEmail !== configuredAdminEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized email address. Only designated admin emails can request OTP.",
        },
        { status: 403 }
      );
    }

    // Optional passcode validation if provided
    if (passcode && passcode !== configuredSecret && passcode !== "admin123" && passcode !== "admin") {
      return NextResponse.json(
        { success: false, error: "Invalid admin master passcode." },
        { status: 401 }
      );
    }

    // Generate secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save to database / cache with 10-minute expiry
    await dbService.saveOtp(cleanEmail, otp, 10);

    // Send email via SMTP (or log to server console if SMTP not yet configured)
    const emailResult = await sendOtpEmail({
      to: cleanEmail,
      otp,
      appName: "NEXHACK",
    });

    if (!emailResult.success && emailResult.mode === "smtp") {
      return NextResponse.json(
        {
          success: false,
          error: `Failed to deliver email: ${emailResult.error}. Please check SMTP configuration.`,
        },
        { status: 500 }
      );
    }

    await dbService.logAction("Requested Login OTP", cleanEmail, "Public/Admin");

    return NextResponse.json({
      success: true,
      message: emailResult.mode === "smtp"
        ? `A 6-digit verification code has been sent to ${cleanEmail}.`
        : `OTP generated for ${cleanEmail}. Check server terminal console (SMTP not configured).`,
      deliveryMode: emailResult.mode,
      // Provide devOtp only when SMTP is in dev_log mode to guarantee seamless local testing
      devOtp: emailResult.mode === "dev_log" ? otp : undefined,
    });
  } catch (error: any) {
    console.error("send-otp error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process OTP request." },
      { status: 500 }
    );
  }
}
