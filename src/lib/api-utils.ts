import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { auth } from "./auth";

/**
 * Utility helpers shared across API routes.
 */

/** Get the current session or return a 401 response. */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    return { session: null, error: unauthorized() };
  }
  return { session, error: null };
}

/** 401 Unauthorized response. */
export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/** 403 Forbidden response. */
export function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

/** 404 Not Found response. */
export function notFound(resource = "Resource") {
  return NextResponse.json(
    { error: `${resource} not found` },
    { status: 404 },
  );
}

/** Format Zod errors into a structured response. */
export function validationError(error: ZodError) {
  const details: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!details[key]) details[key] = [];
    details[key].push(issue.message);
  }
  return NextResponse.json(
    { error: "Validation failed", details },
    { status: 400 },
  );
}
