import PostCard from "@/components/post-card";
import SuggestionsPanel from "@/components/suggestions-panel";
import { posts } from "@/lib/mock-data";

/**
 * Home feed page — the main landing page.
 *
 * Layout:
 *  - Center column: vertical list of PostCards
 *  - Right sidebar (desktop only): SuggestionsPanel
 *
 * Content offset accommodates the fixed navbar (pt-20 top, pb-24 bottom for mobile).
 */

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-5xl gap-8 px-4 pt-20 pb-24 md:pb-8">
      {/* ── Feed column ── */}
      <section className="flex w-full max-w-[480px] flex-col gap-6 mx-auto lg:mx-0">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>

      {/* ── Sidebar (desktop only) ── */}
      <div className="hidden lg:block sticky top-20 self-start pt-2">
        <SuggestionsPanel />
      </div>
    </div>
  );
}
