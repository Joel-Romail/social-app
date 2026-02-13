import { prisma } from "@/lib/prisma";
import { validationError } from "@/lib/api-utils";
import { signupSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

/**
 * POST /api/signup — Register a new user.
 *
 * Validates input with Zod, checks for duplicate email/username,
 * hashes the password with bcrypt (12 rounds), and creates the user.
 */
export async function POST(request: Request) {
  const body = await request.json();

  // 1. Validate input
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { name, email, username, password } = parsed.data;

  // 2. Check for existing email or username
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (existing) {
    const field = existing.email === email ? "email" : "username";
    return NextResponse.json(
      { error: `A user with that ${field} already exists` },
      { status: 409 },
    );
  }

  // 3. Hash password (12 rounds — good balance of security and speed)
  const hashedPassword = await bcrypt.hash(password, 12);

  // 4. Create user
  const user = await prisma.user.create({
    data: { name, email, username, hashedPassword },
    select: { id: true, name: true, username: true, email: true },
  });

  return NextResponse.json(user, { status: 201 });
}
