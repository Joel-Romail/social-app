import { requireAuth, validationError } from "@/lib/api-utils";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Comment, PaginatedResponse } from "@/lib/types";
import { createCommentSchema, paginationSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ postId: string }> };

/**
 * GET /api/posts/[postId]/comments — Fetch comments for a post.
 *
 * Supports cursor-based pagination via ?cursor=&limit= query params.
 * Returns newest comments first.
 */
export async function GET(request: Request, { params }: Params) {
  const { postId } = await params;
  await auth(); // optional: no auth required to read comments

  const url = new URL(request.url);
  const parsed = paginationSchema.safeParse({
    cursor: url.searchParams.get("cursor") ?? undefined,
    limit: url.searchParams.get("limit") ?? undefined,
  });
  if (!parsed.success) return validationError(parsed.error);
  const { cursor, limit } = parsed.data;

  const comments = await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "desc" },
    take: limit + 1, // fetch one extra to detect next page
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: {
      user: { select: { id: true, name: true, username: true, image: true } },
    },
  });

  const hasMore = comments.length > limit;
  if (hasMore) comments.pop(); // remove the extra item

  const data: Comment[] = comments.map((c) => ({
    id: c.id,
    content: c.content,
    author: c.user,
    createdAt: c.createdAt.toISOString(),
  }));

  const response: PaginatedResponse<Comment> = {
    data,
    nextCursor: hasMore ? comments[comments.length - 1].id : null,
  };

  return NextResponse.json(response);
}

/**
 * POST /api/posts/[postId]/comments — Add a comment to a post.
 *
 * Requires authentication. Validates content length.
 */
export async function POST(request: Request, { params }: Params) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { postId } = await params;

  const body = await request.json();
  const parsed = createCommentSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const comment = await prisma.comment.create({
    data: {
      content: parsed.data.content,
      userId: session!.user.id,
      postId,
    },
    include: {
      user: { select: { id: true, name: true, username: true, image: true } },
    },
  });

  const response: Comment = {
    id: comment.id,
    content: comment.content,
    author: comment.user,
    createdAt: comment.createdAt.toISOString(),
  };

  return NextResponse.json(response, { status: 201 });
}
