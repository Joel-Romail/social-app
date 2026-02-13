import type {
  Comment,
  PaginatedResponse,
  Post,
  UserProfile,
} from "./types";

/**
 * Frontend API client.
 *
 * Thin wrappers around fetch() that handle JSON serialization and error
 * throwing. Every function returns typed data or throws an error with
 * the API's error message.
 */

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Something went wrong");
  return data as T;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function signup(body: {
  name: string;
  email: string;
  username: string;
  password: string;
}) {
  return request<{ id: string }>("/api/signup", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// ─── Users ───────────────────────────────────────────────────────────────────

export async function getUser(username: string) {
  return request<UserProfile>(`/api/users/${username}`);
}

// ─── Posts ───────────────────────────────────────────────────────────────────

export async function createPost(body: {
  imageUrl: string;
  caption?: string;
}) {
  return request<Post>("/api/posts", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getPost(postId: string) {
  return request<Post>(`/api/posts/${postId}`);
}

export async function deletePost(postId: string) {
  return request<{ success: boolean }>(`/api/posts/${postId}`, {
    method: "DELETE",
  });
}

// ─── Feed ────────────────────────────────────────────────────────────────────

export async function getFeed(cursor?: string, limit = 10) {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.set("cursor", cursor);
  return request<PaginatedResponse<Post>>(`/api/feed?${params}`);
}

// ─── Likes ───────────────────────────────────────────────────────────────────

export async function toggleLike(postId: string) {
  return request<{ liked: boolean; likesCount: number }>(
    `/api/posts/${postId}/like`,
    { method: "POST" },
  );
}

// ─── Comments ────────────────────────────────────────────────────────────────

export async function getComments(
  postId: string,
  cursor?: string,
  limit = 20,
) {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.set("cursor", cursor);
  return request<PaginatedResponse<Comment>>(
    `/api/posts/${postId}/comments?${params}`,
  );
}

export async function addComment(postId: string, content: string) {
  return request<Comment>(`/api/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

// ─── Follow ──────────────────────────────────────────────────────────────────

export async function toggleFollow(userId: string) {
  return request<{ following: boolean; followersCount: number }>(
    `/api/follow/${userId}`,
    { method: "POST" },
  );
}
