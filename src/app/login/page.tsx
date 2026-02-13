"use client";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import Link from "next/link";
import type { FormEvent } from "react";

/**
 * Login page — centered card layout with email + password fields.
 *
 * No backend logic — form submission is stubbed with preventDefault.
 * Includes a link to the signup page and a divider for future OAuth buttons.
 */

export default function LoginPage() {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: wire up authentication
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-8">
          {/* Brand */}
          <div className="mb-8 flex flex-col items-center gap-2">
            <Camera size={36} className="text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Social App</h1>
            <p className="text-sm text-muted-foreground">
              Log in to see photos and videos from friends.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              required
            />
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="Your password"
              required
            />
            <Button type="submit" size="lg" className="mt-2 w-full">
              Log In
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium text-muted-foreground">
              OR
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>

          {/* Placeholder OAuth */}
          <Button variant="secondary" size="lg" className="w-full">
            Continue with Google
          </Button>
        </div>

        {/* Signup link */}
        <div className="mt-4 rounded-2xl border border-border bg-card p-5 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
