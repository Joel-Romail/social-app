"use client";

import Avatar from "@/components/ui/avatar";
import Button from "@/components/ui/button";
import { currentUser, posts } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { Grid3x3, Settings } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

/**
 * Profile page — displays the current user's profile.
 *
 * Sections:
 *  1. Hero: avatar, display name, bio, stats (posts/followers/following)
 *  2. Actions: Edit Profile / Settings buttons
 *  3. Post grid: square thumbnails in a 3-column grid
 *
 * In a real app the user would come from URL params + API. Here we use
 * the `currentUser` mock for layout purposes.
 */

export default function ProfilePage() {
  const user = currentUser;
  // Show all posts to demonstrate the grid (mock user has no authored posts in feed)
  const displayPosts = posts;
  const [following, setFollowing] = useState(user.isFollowing);

  return (
    <div className="mx-auto max-w-4xl px-4 pt-20 pb-24 md:pb-8">
      {/* ── Hero section ── */}
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-12">
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Avatar
            src={user.avatarUrl}
            alt={user.displayName}
            size="xl"
            className="ring-4 ring-border"
          />
        </motion.div>

        {/* Info */}
        <div className="flex flex-1 flex-col items-center gap-4 md:items-start">
          {/* Username + actions */}
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-semibold">{user.username}</h1>
            <Button
              variant={following ? "secondary" : "primary"}
              size="sm"
              onClick={() => setFollowing((f) => !f)}
            >
              {following ? "Following" : "Follow"}
            </Button>
            <button
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Settings"
            >
              <Settings size={20} />
            </button>
          </div>

          {/* Stats row */}
          <div className="flex gap-8 text-sm">
            <Stat label="posts" value={user.postsCount} />
            <Stat label="followers" value={user.followersCount} />
            <Stat label="following" value={user.followingCount} />
          </div>

          {/* Bio */}
          <div className="text-center md:text-left">
            <p className="font-semibold">{user.displayName}</p>
            <p className="mt-1 text-sm text-muted-foreground">{user.bio}</p>
          </div>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="mt-8 flex justify-center border-t border-border">
        <button className="flex items-center gap-1.5 border-t-2 border-foreground px-4 py-3 text-xs font-semibold uppercase tracking-wider">
          <Grid3x3 size={14} />
          Posts
        </button>
      </div>

      {/* ── Post grid ── */}
      <div className="mt-1 grid grid-cols-3 gap-1">
        {displayPosts.map((post, i) => (
          <motion.div
            key={post.id}
            className="relative aspect-square cursor-pointer overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.02 }}
          >
            <Image
              src={post.imageUrl}
              alt={post.caption}
              fill
              sizes="(max-width: 640px) 33vw, 260px"
              className="object-cover"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/** Inline stat display (e.g. "42 posts") */
function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex gap-1">
      <span className="font-semibold">{value.toLocaleString()}</span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}
