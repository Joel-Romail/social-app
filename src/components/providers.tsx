"use client";

import { SessionProvider } from "next-auth/react";

/**
 * Client-side providers wrapper.
 *
 * SessionProvider makes `useSession()` available throughout the app.
 * Add other providers (theme, toast, etc.) here as needed.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
