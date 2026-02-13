import { auth } from "@/lib/auth";
import {
  forbidden,
  notFound,
  requireAuth,
  validationError,
} from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import type { Post } from "@/lib/types";
import { updatePostSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ postId: string }> };

/**
 * GET /api/posts/[postId] — Fetch a single post with author, counts, like status.
 */
export async function GET(_request: Request, { params }: Params) {
  const { postId } = await params;
  const session = await auth();
  const viewerId = session?.user?.id;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      user: { select: { id: true, name: true, username: true, image: true } },
      _count: { select: { likes: true, comments: true } },
      ...(viewerId
        ? {
            likes: {
              where: { userId: viewerId },
              select: { id: true },
              take: 1,
            },
          }
        : {}),
    },
  });

  if (!post) return notFound("Post");

  const response: Post = {
    id: post.id,
    imageUrl: post.imageUrl,
    caption: post.caption,
    author: post.user,
    likesCount: post._count.likes,
    commentsCount: post._count.comments,
    isLiked: "likes" in post ? (post.likes as unknown[]).length > 0 : false,
    createdAt: post.createdAt.toISOString(),
  };

  return NextResponse.json(response);
}

/**
 * PATCH /api/posts/[postId] — Update a post's caption.
 *
 * Only the post's author can update it.
 */
export async function PATCH(request: Request, { params }: Params) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { postId } = await params;
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return notFound("Post");
  if (post.userId !== session!.user.id) return forbidden();

  const body = await request.json();
  const parsed = updatePostSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const updated = await prisma.post.update({
    where: { id: postId },
    data: { caption: parsed.data.caption },
  });

  return NextResponse.json(updated);
}

/**
 * DELETE /api/posts/[postId] — Delete a post and all related likes/comments.
 *
 * Only the post's author can delete it. Cascading deletes handle cleanup.
 */
export async function DELETE(_request: Request, { params }: Params) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { postId } = await params;
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return notFound("Post");
  if (post.userId !== session!.user.id) return forbidden();

  await prisma.post.delete({ where: { id: postId } });

  return NextResponse.json({ success: true });
}
