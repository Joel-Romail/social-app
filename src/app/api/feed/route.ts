import { requireAuth, validationError } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import type { PaginatedResponse, Post } from "@/lib/types";
import { paginationSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

/**
 * GET /api/feed — Fetch the authenticated user's feed.
 *
 * Returns posts from users the current user follows, ordered by newest first.
 * Uses cursor-based pagination for efficient scrolling.
 *
 * Query params:
 *  - cursor: post ID to paginate from
 *  - limit:  number of posts per page (default 10, max 50)
 *
 * Strategy:
 *  1. Get the list of followed user IDs
 *  2. Query posts where userId is in that list
 *  3. For each post, check if the viewer has liked it
 */
export async function GET(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const userId = session!.user.id;

  const url = new URL(request.url);
  const parsed = paginationSchema.safeParse({
    cursor: url.searchParams.get("cursor") ?? undefined,
    limit: url.searchParams.get("limit") ?? undefined,
  });
  if (!parsed.success) return validationError(parsed.error);
  const { cursor, limit } = parsed.data;

  // Step 1: Get IDs of users the viewer follows
  const follows = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  const followingIds = follows.map((f) => f.followingId);

  // Include the user's own posts in the feed
  followingIds.push(userId);

  // Step 2: Fetch posts with author + counts + viewer like status
  const posts = await prisma.post.findMany({
    where: { userId: { in: followingIds } },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: {
      user: { select: { id: true, name: true, username: true, image: true } },
      _count: { select: { likes: true, comments: true } },
      likes: {
        where: { userId },
        select: { id: true },
        take: 1,
      },
    },
  });

  const hasMore = posts.length > limit;
  if (hasMore) posts.pop();

  const data: Post[] = posts.map((post) => ({
    id: post.id,
    imageUrl: post.imageUrl,
    caption: post.caption,
    author: post.user,
    likesCount: post._count.likes,
    commentsCount: post._count.comments,
    isLiked: post.likes.length > 0,
    createdAt: post.createdAt.toISOString(),
  }));

  const response: PaginatedResponse<Post> = {
    data,
    nextCursor: hasMore ? posts[posts.length - 1].id : null,
  };

  return NextResponse.json(response);
}
