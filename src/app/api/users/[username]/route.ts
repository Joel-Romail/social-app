import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "@/lib/api-utils";
import { NextResponse } from "next/server";
import type { UserProfile } from "@/lib/types";

/**
 * GET /api/users/[username] — Fetch a user's public profile.
 *
 * Returns the user with aggregated counts (posts, followers, following)
 * and whether the current viewer is following them.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  const session = await auth();
  const viewerId = session?.user?.id;

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      image: true,
      bio: true,
      createdAt: true,
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        },
      },
      // Check if viewer follows this user (empty array = not following)
      ...(viewerId
        ? {
            followers: {
              where: { followerId: viewerId },
              select: { id: true },
              take: 1,
            },
          }
        : {}),
    },
  });

  if (!user) return notFound("User");

  const profile: UserProfile = {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    image: user.image,
    bio: user.bio,
    createdAt: user.createdAt.toISOString(),
    postsCount: user._count.posts,
    followersCount: user._count.followers,
    followingCount: user._count.following,
    isFollowing:
      "followers" in user
        ? (user.followers as { id: string }[]).length > 0
        : false,
  };

  return NextResponse.json(profile);
}
