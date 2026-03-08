"use client";

import { useState } from "react";
import { signup } from "../login/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { uUseToast } from "@/components/ui/UseToast";
import Link from "next/link";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = uUseToast();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      await signup(formData);
    } catch (error: any) {
      toast({
        title: "Registration Error",
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden bg-(--background-image-gradient-main)">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-purple/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-orange/20 rounded-full blur-[120px] animate-pulse" />

      <div className="w-full max-w-[420px] space-y-8 rounded-[40px] border border-white/20 bg-white/70 p-10 shadow-2xl backdrop-blur-2xl relative z-10">
        <div className="space-y-2 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-purple text-white shadow-lg shadow-brand-purple/30 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
            Create an account
          </h1>
          <p className="text-sm font-medium text-zinc-500">
            Enter your details to get started with your new platform
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="name@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-3 pt-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign up"}
            </Button>
            <p className="text-center text-sm text-zinc-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-zinc-900 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
        <p className="text-center text-xs text-zinc-400">
          By continuing, you agree to our{" "}
          <a
            href="#"
            className="underline hover:text-zinc-600 transition-colors"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="underline hover:text-zinc-600 transition-colors"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
