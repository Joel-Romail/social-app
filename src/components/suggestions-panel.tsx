"use client";

import { toggleFollow } from "@/lib/api-client";
import type { UserSummary } from "@/lib/types";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import Avatar from "./ui/avatar";
import Button from "./ui/button";

/**
 * SuggestionsPanel — "Suggested for you" sidebar shown on desktop feeds.
 *
 * Receives a list of suggested users from the parent. Each row includes
 * avatar, username, and a Follow toggle that calls POST /api/follow/[userId].
 */

interface SuggestionsPanelProps {
  users: (UserSummary & { bio?: string | null; isFollowing: boolean })[];
}

export default function SuggestionsPanel({ users }: SuggestionsPanelProps) {
  if (users.length === 0) return null;

  return (
    <aside className="w-72 shrink-0">
      <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
        Suggested for you
      </h3>
      <div className="flex flex-col gap-3">
        {users.map((user, i) => (
          <motion.div
            key={user.id}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={`/profile/${user.username}`}>
              <Avatar
                src={user.image ?? undefined}
                alt={user.name}
                size="sm"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                href={`/profile/${user.username}`}
                className="block truncate text-sm font-semibold hover:underline"
              >
                {user.username}
              </Link>
              {user.bio && (
                <p className="truncate text-xs text-muted-foreground">
                  {user.bio}
                </p>
              )}
            </div>
            <FollowButton
              userId={user.id}
              initialFollowing={user.isFollowing}
            />
          </motion.div>
        ))}
      </div>
    </aside>
  );
}

function FollowButton({
  userId,
  initialFollowing,
}: {
  userId: string;
  initialFollowing: boolean;
}) {
  const [following, setFollowing] = useState(initialFollowing);

  const handleClick = async () => {
    const prev = following;
    setFollowing(!prev);
    try {
      const result = await toggleFollow(userId);
      setFollowing(result.following);
    } catch {
      setFollowing(prev);
    }
  };

  return (
    <Button
      variant={following ? "secondary" : "primary"}
      size="sm"
      onClick={handleClick}
    >
      {following ? "Following" : "Follow"}
    </Button>
  );
}
