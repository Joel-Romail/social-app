import { z } from "zod";

/**
 * Zod schemas for input validation.
 *
 * Every API route validates its input against these schemas before
 * touching the database. This prevents malformed data, SQL injection
 * via Prisma (already safe), and provides clear error messages.
 */

// ─── Auth ────────────────────────────────────────────────────────────────────

export const signupSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ─── Posts ───────────────────────────────────────────────────────────────────

export const createPostSchema = z.object({
  imageUrl: z.string().url("Invalid image URL"),
  caption: z.string().max(2200, "Caption too long").optional().default(""),
});

export const updatePostSchema = z.object({
  caption: z.string().max(2200, "Caption too long"),
});

// ─── Comments ───────────────────────────────────────────────────────────────

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment too long"),
});

// ─── Pagination ─────────────────────────────────────────────────────────────

export const paginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
});
