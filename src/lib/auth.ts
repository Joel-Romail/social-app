import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { loginSchema } from "./validations";

/**
 * Auth.js v5 configuration.
 *
 * Uses the Credentials provider with email + password. Passwords are
 * verified against bcrypt hashes stored in the database.
 *
 * Session strategy: JWT (stateless, no session table needed).
 * The JWT callback embeds the user ID and username so they're available
 * in `session.user` without an extra DB query on every request.
 */

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        // Validate input shape
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // Look up user by email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        // Verify password against stored hash
        const isValid = await bcrypt.compare(password, user.hashedPassword);
        if (!isValid) return null;

        // Return the user object — Auth.js stores this in the JWT
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          username: user.username,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  pages: {
    signIn: "/login", // redirect to our custom login page
  },

  callbacks: {
    /** Embed extra fields (id, username) into the JWT. */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as { username: string }).username;
      }
      return token;
    },

    /** Expose id and username on session.user for client-side access. */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { username: string }).username =
          token.username as string;
      }
      return session;
    },
  },
});
