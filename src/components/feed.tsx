"use client";

import { getFeed } from "@/lib/api-client";
import type { Post } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import PostCard from "./post-card";
import Button from "./ui/button";

/**
 * Feed — infinite-scroll feed of posts from followed users.
 *
 * Fetches from GET /api/feed with cursor-based pagination.
 * Shows loading skeleton on initial load, and a "Load more" button for
 * subsequent pages (prefer explicit load over infinite scroll for
 * accessibility and control).
 *
 * Falls back to mock data when not authenticated (for demo purposes).
 */

interface FeedProps {
  /** Optional initial posts (from server-side or mock data) */
  initialPosts?: Post[];
}

export default function Feed({ initialPosts }: FeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts ?? []);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(!initialPosts);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Initial fetch (only if no initialPosts provided)
  useEffect(() => {
    if (initialPosts) return;
    let cancelled = false;

    async function fetchInitial() {
      try {
        const res = await getFeed();
        if (cancelled) return;
        setPosts(res.data);
        setCursor(res.nextCursor);
        setHasMore(!!res.nextCursor);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load feed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchInitial();
    return () => {
      cancelled = true;
    };
  }, [initialPosts]);

  const loadMore = useCallback(async () => {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await getFeed(cursor);
      setPosts((prev) => [...prev, ...res.data]);
      setCursor(res.nextCursor);
      setHasMore(!!res.nextCursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load more");
    } finally {
      setLoadingMore(false);
    }
  }, [cursor, loadingMore]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={32} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Error state
  if (error && posts.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button
          variant="secondary"
          size="sm"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  // Empty state
  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-lg font-semibold">Your feed is empty</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Follow some users to see their posts here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {hasMore && (
        <div className="flex justify-center py-4">
          <Button
            variant="ghost"
            onClick={loadMore}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <Loader2 size={16} className="mr-2 animate-spin" />
            ) : null}
            {loadingMore ? "Loading..." : "Load more"}
          </Button>
        </div>
      )}
    </div>
  );
}
