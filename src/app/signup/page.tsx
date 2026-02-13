"use client";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import Link from "next/link";
import type { FormEvent } from "react";

/**
 * Signup page — centered card layout with name, email, username, and password fields.
 *
 * No backend logic — form submission is stubbed with preventDefault.
 * Mirrors the login page design for visual consistency.
 */

export default function SignupPage() {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: wire up registration
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
            <p className="text-sm text-center text-muted-foreground">
              Sign up to see photos and videos from your friends.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              id="name"
              label="Full Name"
              type="text"
              placeholder="Jane Doe"
              required
            />
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              required
            />
            <Input
              id="username"
              label="Username"
              type="text"
              placeholder="janedoe"
              required
            />
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              required
              minLength={8}
            />
            <Button type="submit" size="lg" className="mt-2 w-full">
              Sign Up
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            By signing up, you agree to our Terms and Privacy Policy.
          </p>
        </div>

        {/* Login link */}
        <div className="mt-4 rounded-2xl border border-border bg-card p-5 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Log in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
