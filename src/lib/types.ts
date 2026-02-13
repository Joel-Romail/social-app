/**
 * Shared types between frontend and backend.
 *
 * These are the *API response shapes* — not raw Prisma models. They include
 * computed fields (counts, isFollowing, isLiked) that the API routes add.
 */

// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  image: string | null;
  bio: string | null;
  createdAt: string;
}

/** User with aggregated counts — used on profile pages and post cards. */
export interface UserProfile extends User {
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}

/** Compact user shape used in post headers and comment authors. */
export interface UserSummary {
  id: string;
  name: string;
  username: string;
  image: string | null;
}

// ─── Post ────────────────────────────────────────────────────────────────────

export interface Post {
  id: string;
  imageUrl: string;
  caption: string;
  author: UserSummary;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  createdAt: string;
}

// ─── Comment ─────────────────────────────────────────────────────────────────

export interface Comment {
  id: string;
  content: string;
  author: UserSummary;
  createdAt: string;
}

// ─── Pagination ──────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  nextCursor: string | null;
}

// ─── API Error ───────────────────────────────────────────────────────────────

export interface ApiError {
  error: string;
  details?: Record<string, string[]>;
}
