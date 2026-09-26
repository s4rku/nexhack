import nodemailer from "nodemailer";

export function isSmtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  );
}

export async function sendOtpEmail({
  to,
  otp,
  appName = "NEXHACK",
}: {
  to: string;
  otp: string;
  appName?: string;
}): Promise<{ success: boolean; mode: "smtp" | "dev_log"; error?: string }> {
  // If SMTP is NOT configured, print OTP to server console for testing/development
  if (!isSmtpConfigured()) {
    console.log("\n=======================================================");
    console.log(`🔐 [${appName} SECURITY] ADMIN LOGIN OTP DISPATCHED`);
    console.log(`📧 Destination Email: ${to}`);
    console.log(`🔑 Verification Code: ${otp}`);
    console.log(`⏳ Validity: 10 Minutes`);
    console.log("💡 Tip: Add SMTP_HOST, SMTP_USER, SMTP_PASS to .env.local for real emails.");
    console.log("=======================================================\n");

    return { success: true, mode: "dev_log" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const fromAddress = process.env.SMTP_FROM || `"NEXHACK Security" <${process.env.SMTP_USER}>`;

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>${appName} Admin Security Verification</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 40px 15px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="520" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #111827; border: 1px solid #1f293d; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
              <!-- Header Gradient -->
              <tr>
                <td style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 32px 30px; text-align: center;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff;">
                    NEX<span style="color: #67e8f9;">HACK</span>
                  </h1>
                  <p style="margin: 6px 0 0; font-size: 13px; color: #e2e8f0; font-weight: 500;">
                    Admin Security Authentication
                  </p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 36px 32px;">
                  <p style="margin: 0 0 16px; font-size: 15px; color: #cbd5e1; line-height: 1.6;">
                    Hello Admin,
                  </p>
                  <p style="margin: 0 0 24px; font-size: 14px; color: #94a3b8; line-height: 1.6;">
                    A sign-in request to the <strong>${appName} Control Console</strong> was initiated. Use the single-use verification code below to complete your authentication:
                  </p>

                  <!-- OTP Box -->
                  <div style="background-color: #090d16; border: 1px dashed #3b82f6; border-radius: 14px; padding: 22px; text-align: center; margin: 26px 0;">
                    <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #38bdf8; display: inline-block;">
                      ${otp}
                    </span>
                    <p style="margin: 10px 0 0; font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                      Expires in 10 minutes
                    </p>
                  </div>

                  <p style="margin: 0 0 16px; font-size: 13px; color: #94a3b8; line-height: 1.6;">
                    If you did not make this login request, no action is needed. Your account remains secured, but you may want to review your server logs.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #0d121f; padding: 20px 30px; text-align: center; border-top: 1px solid #1e293b;">
                  <p style="margin: 0; font-size: 11px; color: #64748b;">
                    © 2026 NEXHACK Community. Automated Security Dispatch.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    await transporter.sendMail({
      from: fromAddress,
      to,
      subject: `[${appName} Admin] ${otp} is your verification code`,
      html: htmlContent,
      text: `Your ${appName} Admin Login verification code is: ${otp}. It will expire in 10 minutes.`,
    });

    return { success: true, mode: "smtp" };
  } catch (error: any) {
    console.error("Nodemailer error sending OTP:", error);
    return { success: false, mode: "smtp", error: error.message };
  }
}
