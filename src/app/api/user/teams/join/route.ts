import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbService } from "@/lib/mongodb";

// POST /api/user/teams/join — join by invite code OR send a join request
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { inviteCode, teamId, message } = body;

    // ── Join by invite code (direct join) ──
    if (inviteCode) {
      const team = await dbService.getTeamByInviteCode(inviteCode);
      if (!team) {
        return NextResponse.json({ success: false, error: "Invalid invite code. Check and try again." }, { status: 404 });
      }
      if (!team.isOpen) {
        return NextResponse.json({ success: false, error: "This team is not accepting new members." }, { status: 403 });
      }
      if (team.members.length >= team.maxSize) {
        return NextResponse.json({ success: false, error: "This team is full." }, { status: 409 });
      }
      if (team.members.some((m) => m.userId === session.user.id)) {
        return NextResponse.json({ success: false, error: "You are already in this team." }, { status: 409 });
      }

      const profile = await dbService.getUserProfile(session.user.id);
      await dbService.addTeamMember(team.id, {
        userId: session.user.id,
        displayName: profile?.displayName || session.user.name || "Member",
        avatarUrl: profile?.avatarUrl || session.user.image || undefined,
        email: session.user.email ?? "",
        role: "member",
        joinedAt: new Date().toISOString(),
      });

      const updated = await dbService.getTeam(team.id);
      return NextResponse.json({ success: true, joined: true, team: updated });
    }

    // ── Request to join by teamId ──
    if (teamId) {
      const team = await dbService.getTeam(teamId);
      if (!team) {
        return NextResponse.json({ success: false, error: "Team not found" }, { status: 404 });
      }
      if (!team.isOpen) {
        return NextResponse.json({ success: false, error: "This team is not accepting requests." }, { status: 403 });
      }
      if (team.members.length >= team.maxSize) {
        return NextResponse.json({ success: false, error: "This team is full." }, { status: 409 });
      }
      if (team.members.some((m) => m.userId === session.user.id)) {
        return NextResponse.json({ success: false, error: "You are already in this team." }, { status: 409 });
      }
      const alreadyRequested = await dbService.hasPendingRequest(teamId, session.user.id);
      if (alreadyRequested) {
        return NextResponse.json({ success: false, error: "You already have a pending request for this team." }, { status: 409 });
      }

      const profile = await dbService.getUserProfile(session.user.id);
      const request = await dbService.createJoinRequest({
        teamId,
        teamName: team.name,
        userId: session.user.id,
        userDisplayName: profile?.displayName || session.user.name || "Unknown",
        userEmail: session.user.email ?? "",
        userAvatarUrl: profile?.avatarUrl || session.user.image || undefined,
        message: message?.trim(),
      });

      return NextResponse.json({ success: true, joined: false, request }, { status: 201 });
    }

    return NextResponse.json({ success: false, error: "Provide inviteCode or teamId" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
