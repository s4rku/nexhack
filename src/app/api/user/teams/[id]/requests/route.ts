import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbService } from "@/lib/mongodb";

// GET /api/user/teams/[id]/requests — list pending join requests (captain only)
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
  if (team.captainId !== session.user.id) {
    return NextResponse.json({ success: false, error: "Only the captain can view join requests" }, { status: 403 });
  }

  const requests = await dbService.getJoinRequestsByTeam(id);
  return NextResponse.json({ success: true, requests });
}

// PATCH /api/user/teams/[id]/requests — accept or reject a join request (captain only)
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
    return NextResponse.json({ success: false, error: "Only the captain can manage join requests" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { requestId, action } = body; // action: "accept" | "reject"

    if (!requestId || !["accept", "reject"].includes(action)) {
      return NextResponse.json({ success: false, error: "requestId and action (accept|reject) required" }, { status: 400 });
    }

    const status = action === "accept" ? "Accepted" : "Rejected";
    const updatedRequest = await dbService.updateJoinRequest(requestId, status);

    if (!updatedRequest) {
      return NextResponse.json({ success: false, error: "Request not found" }, { status: 404 });
    }

    // If accepted, add the user to the team
    if (status === "Accepted") {
      if (team.members.length >= team.maxSize) {
        return NextResponse.json({ success: false, error: "Team is now full" }, { status: 409 });
      }
      await dbService.addTeamMember(id, {
        userId: updatedRequest.userId,
        displayName: updatedRequest.userDisplayName,
        avatarUrl: updatedRequest.userAvatarUrl,
        email: updatedRequest.userEmail,
        role: "member",
        joinedAt: new Date().toISOString(),
      });
    }

    const updatedTeam = await dbService.getTeam(id);
    return NextResponse.json({ success: true, request: updatedRequest, team: updatedTeam });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
