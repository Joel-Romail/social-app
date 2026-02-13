"use client";

import type { Post } from "@/lib/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Bookmark, Heart, MessageCircle, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Avatar from "./ui/avatar";

/**
 * PostCard — a single post in the feed.
 *
 * Layout (top to bottom):
 *  1. Header: avatar + username + timestamp
 *  2. Image: square aspect ratio with hover zoom
 *  3. Actions: like, comment, share, bookmark
 *  4. Likes count + caption preview
 *
 * The like button animates with a scale pop on toggle.
 * Double-tapping the image also toggles like (Instagram-style).
 */

interface PostCardProps {
  post: Post;
  className?: string;
}

export default function PostCard({ post, className }: PostCardProps) {
  const [liked, setLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [showHeart, setShowHeart] = useState(false);

  const toggleLike = () => {
    setLiked((prev) => !prev);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleDoubleTap = () => {
    if (!liked) toggleLike();
    // Show heart overlay animation
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  const timeAgo = getTimeAgo(post.createdAt);

  return (
    <motion.article
      className={cn("overflow-hidden rounded-2xl border border-border bg-card", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-4 py-3">
        <Link href={`/profile/${post.author.username}`}>
          <Avatar
            src={post.author.avatarUrl}
            alt={post.author.displayName}
            size="sm"
          />
        </Link>
        <div className="flex-1">
          <Link
            href={`/profile/${post.author.username}`}
            className="text-sm font-semibold hover:underline"
          >
            {post.author.username}
          </Link>
        </div>
        <span className="text-xs text-muted-foreground">{timeAgo}</span>
      </div>

      {/* ── Image ── */}
      <div
        className="relative aspect-square cursor-pointer overflow-hidden"
        onDoubleClick={handleDoubleTap}
      >
        <Image
          src={post.imageUrl}
          alt={post.caption}
          fill
          sizes="(max-width: 640px) 100vw, 480px"
          className="object-cover transition-transform duration-300 hover:scale-105"
        />

        {/* Double-tap heart overlay */}
        <AnimatedHeart visible={showHeart} />
      </div>

      {/* ── Actions ── */}
      <div className="flex items-center gap-4 px-4 pt-3">
        <motion.button
          whileTap={{ scale: 1.3 }}
          onClick={toggleLike}
          aria-label={liked ? "Unlike" : "Like"}
        >
          <Heart
            size={24}
            className={cn(
              "transition-colors",
              liked
                ? "fill-destructive text-destructive"
                : "text-foreground hover:text-muted-foreground",
            )}
          />
        </motion.button>
        <button aria-label="Comment">
          <MessageCircle
            size={24}
            className="text-foreground hover:text-muted-foreground transition-colors"
          />
        </button>
        <button aria-label="Share">
          <Send
            size={24}
            className="text-foreground hover:text-muted-foreground transition-colors"
          />
        </button>
        <button aria-label="Save" className="ml-auto">
          <Bookmark
            size={24}
            className="text-foreground hover:text-muted-foreground transition-colors"
          />
        </button>
      </div>

      {/* ── Likes + caption ── */}
      <div className="px-4 pb-4 pt-2">
        <p className="text-sm font-semibold">
          {likesCount.toLocaleString()} likes
        </p>
        <p className="mt-1 text-sm">
          <Link
            href={`/profile/${post.author.username}`}
            className="font-semibold hover:underline"
          >
            {post.author.username}
          </Link>{" "}
          <span className="text-card-foreground">{post.caption}</span>
        </p>
        {post.commentsCount > 0 && (
          <button className="mt-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            View all {post.commentsCount} comments
          </button>
        )}
      </div>
    </motion.article>
  );
}

/* ── Heart overlay animation (double-tap feedback) ── */
function AnimatedHeart({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        animate={{ scale: [1, 1.2, 0], opacity: [1, 1, 0] }}
        transition={{ duration: 0.8 }}
      >
        <Heart size={80} className="fill-white text-white drop-shadow-lg" />
      </motion.div>
    </motion.div>
  );
}

/* ── Helper: relative time string ── */
function getTimeAgo(dateString: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 1000,
  );

  const intervals: [number, string][] = [
    [31_536_000, "y"],
    [2_592_000, "mo"],
    [604_800, "w"],
    [86_400, "d"],
    [3_600, "h"],
    [60, "m"],
  ];

  for (const [secs, label] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count}${label}`;
  }

  return "now";
}
