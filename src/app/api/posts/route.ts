import { requireAuth, validationError } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import type { Post } from "@/lib/types";
import { createPostSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

/**
 * POST /api/posts — Create a new post.
 *
 * Requires authentication. Validates imageUrl and optional caption.
 */
export async function POST(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const body = await request.json();
  const parsed = createPostSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const post = await prisma.post.create({
    data: {
      imageUrl: parsed.data.imageUrl,
      caption: parsed.data.caption,
      userId: session!.user.id,
    },
    include: {
      user: { select: { id: true, name: true, username: true, image: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  const response: Post = {
    id: post.id,
    imageUrl: post.imageUrl,
    caption: post.caption,
    author: post.user,
    likesCount: post._count.likes,
    commentsCount: post._count.comments,
    isLiked: false,
    createdAt: post.createdAt.toISOString(),
  };

  return NextResponse.json(response, { status: 201 });
}
