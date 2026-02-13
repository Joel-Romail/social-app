import Feed from "@/components/feed";
import SuggestionsPanel from "@/components/suggestions-panel";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Home feed page — the main landing page.
 *
 * Server component that fetches the initial feed data and suggested users,
 * then passes them to client components for interactivity.
 *
 * If the user is not authenticated, shows an empty feed with a prompt to log in.
 */

export default async function HomePage() {
  const session = await auth();
  const userId = session?.user?.id;

  // Fetch suggested users (users not followed by the viewer)
  const suggestions = userId
    ? await prisma.user.findMany({
        where: {
          id: { not: userId },
          followers: { none: { followerId: userId } },
        },
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          bio: true,
        },
        take: 5,
      })
    : [];

  const suggestionsWithFollow = suggestions.map((u) => ({
    ...u,
    isFollowing: false,
  }));

  return (
    <div className="mx-auto flex max-w-5xl gap-8 px-4 pt-20 pb-24 md:pb-8">
      {/* ── Feed column ── */}
      <section className="mx-auto w-full max-w-[480px] lg:mx-0">
        <Feed />
      </section>

      {/* ── Sidebar (desktop only) ── */}
      <div className="sticky top-20 hidden self-start pt-2 lg:block">
        <SuggestionsPanel users={suggestionsWithFollow} />
      </div>
    </div>
  );
}
