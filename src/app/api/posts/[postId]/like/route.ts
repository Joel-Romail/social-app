import { requireAuth } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ postId: string }> };

/**
 * POST /api/posts/[postId]/like — Toggle like on a post.
 *
 * If the user has already liked the post, unlike it. Otherwise, like it.
 * Returns the new like status and updated count.
 *
 * Uses the compound unique constraint (userId, postId) to detect existing likes.
 */
export async function POST(_request: Request, { params }: Params) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { postId } = await params;
  const userId = session!.user.id;

  // Check if like already exists
  const existing = await prisma.like.findUnique({
    where: { userId_postId: { userId, postId } },
  });

  if (existing) {
    // Unlike — remove the row
    await prisma.like.delete({ where: { id: existing.id } });
  } else {
    // Like — create the row
    await prisma.like.create({ data: { userId, postId } });
  }

  // Return fresh count
  const count = await prisma.like.count({ where: { postId } });

  return NextResponse.json({ liked: !existing, likesCount: count });
}
