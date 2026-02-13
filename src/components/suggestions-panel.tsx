"use client";

import { users } from "@/lib/mock-data";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import Avatar from "./ui/avatar";
import Button from "./ui/button";

/**
 * SuggestionsPanel — "Suggested for you" sidebar shown on desktop feeds.
 *
 * Displays a compact list of users the current user might want to follow.
 * Each row includes avatar, username, and a Follow/Following toggle button.
 */

export default function SuggestionsPanel() {
  // Show other users (skip the first who is the "current" user)
  const suggestions = users.slice(1);

  return (
    <aside className="w-72 shrink-0">
      <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
        Suggested for you
      </h3>
      <div className="flex flex-col gap-3">
        {suggestions.map((user, i) => (
          <motion.div
            key={user.id}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={`/profile/${user.username}`}>
              <Avatar
                src={user.avatarUrl}
                alt={user.displayName}
                size="sm"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link
                href={`/profile/${user.username}`}
                className="block truncate text-sm font-semibold hover:underline"
              >
                {user.username}
              </Link>
              <p className="truncate text-xs text-muted-foreground">
                {user.bio}
              </p>
            </div>
            <FollowButton initialFollowing={user.isFollowing} />
          </motion.div>
        ))}
      </div>
    </aside>
  );
}

function FollowButton({ initialFollowing }: { initialFollowing: boolean }) {
  const [following, setFollowing] = useState(initialFollowing);

  return (
    <Button
      variant={following ? "secondary" : "primary"}
      size="sm"
      onClick={() => setFollowing((f) => !f)}
    >
      {following ? "Following" : "Follow"}
    </Button>
  );
}
