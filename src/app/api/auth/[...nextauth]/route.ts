import { handlers } from "@/lib/auth";

/**
 * Auth.js API route handler.
 *
 * This single catch-all route handles:
 *  - POST /api/auth/callback/credentials (login)
 *  - GET  /api/auth/session (session check)
 *  - POST /api/auth/signout (logout)
 *  - GET  /api/auth/csrf (CSRF token)
 */
export const { GET, POST } = handlers;
