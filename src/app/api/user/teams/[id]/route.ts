import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbService } from "@/lib/mongodb";

// GET /api/user/teams/[id] — get a single team
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const team = await dbService.getTeam(id);
  if (!team) {
    return NextResponse.json({ success: false, error: "Team not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, team });
}

// PATCH /api/user/teams/[id] — update team settings (captain only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const team = await dbService.getTeam(id);
  if (!team) {
    return NextResponse.json({ success: false, error: "Team not found" }, { status: 404 });
  }
  if (team.captainId !== session.user.id) {
    return NextResponse.json({ success: false, error: "Only the team captain can edit the team" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { action } = body;

    // ── Delegate role change ──
    if (action === "changeRole") {
      const { targetUserId, role } = body;
      if (!targetUserId || !role) {
        return NextResponse.json({ success: false, error: "targetUserId and role required" }, { status: 400 });
      }
      if (!team.members.find((m) => m.userId === targetUserId)) {
        return NextResponse.json({ success: false, error: "User is not a team member" }, { status: 404 });
      }
      // If promoting to captain, demote current captain first
      if (role === "captain") {
        await dbService.updateMemberRole(id, session.user.id, "member");
        await dbService.updateTeam(id, { captainId: targetUserId });
      }
      await dbService.updateMemberRole(id, targetUserId, role);
      const updated = await dbService.getTeam(id);
      return NextResponse.json({ success: true, team: updated });
    }

    // ── Remove member ──
    if (action === "removeMember") {
      const { targetUserId } = body;
      if (!targetUserId) {
        return NextResponse.json({ success: false, error: "targetUserId required" }, { status: 400 });
      }
      if (targetUserId === team.captainId) {
        return NextResponse.json({ success: false, error: "Cannot remove the team captain" }, { status: 400 });
      }
      await dbService.removeTeamMember(id, targetUserId);
      const updated = await dbService.getTeam(id);
      return NextResponse.json({ success: true, team: updated });
    }

    // ── Toggle open/closed ──
    if (action === "toggleOpen") {
      await dbService.updateTeam(id, { isOpen: !team.isOpen });
      const updated = await dbService.getTeam(id);
      return NextResponse.json({ success: true, team: updated });
    }

    // ── General field update ──
    const allowed = ["name", "tagline", "maxSize", "isOpen"] as const;
    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in body) updates[key] = body[key];
    }
    await dbService.updateTeam(id, updates);
    const updated = await dbService.getTeam(id);
    return NextResponse.json({ success: true, team: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE /api/user/teams/[id] — disband team (captain only) or leave (member)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const team = await dbService.getTeam(id);
  if (!team) {
    return NextResponse.json({ success: false, error: "Team not found" }, { status: 404 });
  }

  const isCaptain = team.captainId === session.user.id;
  const isMember = team.members.some((m) => m.userId === session.user.id);

  if (!isMember) {
    return NextResponse.json({ success: false, error: "You are not in this team" }, { status: 403 });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    if (action === "leave" && !isCaptain) {
      await dbService.removeTeamMember(id, session.user.id);
      return NextResponse.json({ success: true, message: "You left the team." });
    }

    if (isCaptain) {
      // Disband entire team
      await dbService.deleteTeam(id);
      return NextResponse.json({ success: true, message: "Team disbanded." });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
