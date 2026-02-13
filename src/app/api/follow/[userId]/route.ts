import { requireAuth } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ userId: string }> };

/**
 * POST /api/follow/[userId] — Toggle follow on a user.
 *
 * If already following, unfollow. Otherwise, follow.
 * Prevents self-follows. Returns new follow status and updated follower count.
 */
export async function POST(_request: Request, { params }: Params) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { userId: followingId } = await params;
  const followerId = session!.user.id;

  // Prevent self-follow
  if (followerId === followingId) {
    return NextResponse.json(
      { error: "You cannot follow yourself" },
      { status: 400 },
    );
  }

  // Check if follow relationship exists
  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
  } else {
    await prisma.follow.create({ data: { followerId, followingId } });
  }

  // Return updated count
  const followersCount = await prisma.follow.count({
    where: { followingId },
  });

  return NextResponse.json({
    following: !existing,
    followersCount,
  });
}
