"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      try {
        await account.deleteSession({ sessionId: "current" });
      } catch {
        // No active session
      }

      await account.createEmailPasswordSession({ email, password });

      router.push("/chat");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not log in. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 p-6">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <p className="mb-2 text-sm font-semibold text-indigo-600">Next CHAT</p>
        <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
        <p className="mt-2 text-slate-600">
          Log in to continue chatting.
        </p>

        <form onSubmit={handleLogin} className="mt-7 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full text-slate-700 rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full text-slate-700 rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500"
              placeholder="Your password"
            />
          </label>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          New to Next Chat?{" "}
          <Link href="/signup" className="font-semibold text-indigo-600">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}