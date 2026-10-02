import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbService } from "@/lib/mongodb";
import { deleteImageFromCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

// GET /api/user/profile — fetch the current user's profile
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await dbService.getUserProfile(session.user.id);
    return NextResponse.json({ success: true, profile });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PATCH /api/user/profile — create or update profile fields
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Whitelist safe updatable fields
    const allowed = [
      "displayName", "bio", "college", "course", "graduationYear",
      "githubUrl", "linkedinUrl", "twitterUrl", "skills",
      "avatarUrl", "avatarPublicId",
    ] as const;

    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in body) updates[key] = body[key];
    }

    // If replacing avatar and old publicId was provided, delete old image from Cloudinary
    if (body.oldAvatarPublicId && body.avatarUrl && isCloudinaryConfigured()) {
      await deleteImageFromCloudinary(body.oldAvatarPublicId).catch(() => {});
    }

    const profile = await dbService.upsertUserProfile(
      session.user.id,
      session.user.email ?? "",
      updates
    );

    return NextResponse.json({ success: true, profile });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
