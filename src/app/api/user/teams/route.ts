import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbService } from "@/lib/mongodb";

// GET /api/user/teams — teams the current user belongs to
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const teams = await dbService.getTeamsByUserId(session.user.id);
    const requests = await dbService.getJoinRequestsByUser(session.user.id);
    return NextResponse.json({ success: true, teams, requests });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST /api/user/teams — create a new team
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, tagline, hackathonId, maxSize } = body;

    if (!name?.trim()) {
      return NextResponse.json({ success: false, error: "Team name is required" }, { status: 400 });
    }

    // Check user isn't already on a team for this hackathon
    const existingTeams = await dbService.getTeamsByUserId(session.user.id);
    if (hackathonId) {
      const conflict = existingTeams.find((t) => t.hackathonId === hackathonId);
      if (conflict) {
        return NextResponse.json(
          { success: false, error: `You are already on team "${conflict.name}" for this hackathon.` },
          { status: 409 }
        );
      }
    }

    // Get display info from profile, fall back to session
    const profile = await dbService.getUserProfile(session.user.id);

    const team = await dbService.createTeam({
      name,
      tagline,
      hackathonId,
      maxSize: Math.min(Math.max(Number(maxSize) || 4, 2), 6),
      captain: {
        userId: session.user.id,
        displayName: profile?.displayName || session.user.name || "Unknown",
        avatarUrl: profile?.avatarUrl || session.user.image || undefined,
        email: session.user.email ?? "",
        role: "captain",
        joinedAt: new Date().toISOString(),
      },
    });

    return NextResponse.json({ success: true, team }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
