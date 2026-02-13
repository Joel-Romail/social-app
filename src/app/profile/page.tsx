"use client";

import Avatar from "@/components/ui/avatar";
import Button from "@/components/ui/button";
import { getUser, toggleFollow } from "@/lib/api-client";
import type { UserProfile } from "@/lib/types";
import { motion } from "framer-motion";
import { Grid3x3, Loader2, Settings } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

/**
 * Profile page — displays the current user's profile.
 *
 * Fetches the user profile from GET /api/users/[username].
 * Uses the Auth.js session to determine which user to show.
 * Includes follow toggle that calls POST /api/follow/[userId].
 */

export default function ProfilePage() {
  const { data: session, status: sessionStatus } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [following, setFollowing] = useState(false);
  const fetchedRef = useRef(false);

  // Fetch profile once session is available
  useEffect(() => {
    if (sessionStatus !== "authenticated" || !session?.user) return;
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const username = (session.user as { username: string }).username;

    getUser(username)
      .then((profile) => {
        setUser(profile);
        setFollowing(profile.isFollowing);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load profile"),
      );
  }, [session, sessionStatus]);

  const handleFollowToggle = async () => {
    if (!user) return;
    const prev = following;
    setFollowing(!prev);
    try {
      const result = await toggleFollow(user.id);
      setFollowing(result.following);
      setUser((u) =>
        u ? { ...u, followersCount: result.followersCount } : u,
      );
    } catch {
      setFollowing(prev);
    }
  };

  // Session still loading or waiting for profile data
  if (sessionStatus === "loading" || (sessionStatus === "authenticated" && !user && !error)) {
    return (
      <div className="flex justify-center pt-32">
        <Loader2 size={32} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Not authenticated
  if (sessionStatus === "unauthenticated") {
    return (
      <div className="mx-auto max-w-md pt-32 text-center">
        <p className="text-muted-foreground">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  // Error or no user
  if (error || !user) {
    return (
      <div className="mx-auto max-w-md pt-32 text-center">
        <p className="text-muted-foreground">{error ?? "User not found"}</p>
      </div>
    );
  }

  const isOwnProfile = session?.user?.id === user.id;

  return (
    <div className="mx-auto max-w-4xl px-4 pt-20 pb-24 md:pb-8">
      {/* ── Hero section ── */}
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Avatar
            src={user.image ?? undefined}
            alt={user.name}
            size="xl"
            className="ring-4 ring-border"
          />
        </motion.div>

        <div className="flex flex-1 flex-col items-center gap-4 md:items-start">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-semibold">{user.username}</h1>
            {!isOwnProfile && (
              <Button
                variant={following ? "secondary" : "primary"}
                size="sm"
                onClick={handleFollowToggle}
              >
                {following ? "Following" : "Follow"}
              </Button>
            )}
            {isOwnProfile && (
              <Button variant="secondary" size="sm">
                Edit Profile
              </Button>
            )}
            <button
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Settings"
            >
              <Settings size={20} />
            </button>
          </div>

          <div className="flex gap-8 text-sm">
            <Stat label="posts" value={user.postsCount} />
            <Stat label="followers" value={user.followersCount} />
            <Stat label="following" value={user.followingCount} />
          </div>

          <div className="text-center md:text-left">
            <p className="font-semibold">{user.name}</p>
            {user.bio && (
              <p className="mt-1 text-sm text-muted-foreground">{user.bio}</p>
            )}
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

      {/* ── Empty grid placeholder ── */}
      <div className="py-12 text-center text-sm text-muted-foreground">
        No posts yet.
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex gap-1">
      <span className="font-semibold">{value.toLocaleString()}</span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}
