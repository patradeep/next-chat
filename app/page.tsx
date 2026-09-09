import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative max-w-5xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-white tracking-tight">NextChat</span>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-medium">
            1-on-1
          </span>
        </div>
        <Link
          href="/login"
          className="text-xs font-semibold text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-900 px-3.5 py-2 rounded-lg transition"
        >
          Log in
        </Link>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-2xl mx-auto text-center my-auto py-12">
        <span className="inline-flex items-center gap-2 text-xs font-medium text-indigo-300 bg-indigo-950/60 border border-indigo-800/60 px-3 py-1 rounded-full mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Real-time 1-on-1 Messaging
        </span>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Direct messaging, <br />
          <span className="bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">
            simple and real-time.
          </span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-lg mx-auto">
          Connect directly with other registered users in private conversations with instant delivery, unread indicators, and read receipts.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/signup"
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 transition"
          >
            Get Started Free
          </Link>
          <Link
            href="/chat"
            className="rounded-xl border border-slate-800 bg-slate-900/60 px-6 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-900 hover:text-white transition"
          >
            Open Chat
          </Link>
        </div>

        {/* Feature Pills */}
        <div className="mt-12 grid grid-cols-3 gap-3 border-t border-slate-800/80 pt-8 text-left max-w-lg mx-auto">
          <div className="p-2">
            <p className="text-xs font-semibold text-white">⚡ Instant</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Real-time WebSockets</p>
          </div>
          <div className="p-2 border-x border-slate-800/80">
            <p className="text-xs font-semibold text-white">🔒 1-on-1</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Direct user chats</p>
          </div>
          <div className="p-2">
            <p className="text-xs font-semibold text-white">✓✓ Receipts</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Unread tracking</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative max-w-5xl w-full mx-auto text-center text-xs text-slate-600">
        Built with Next.js & Appwrite Cloud
      </footer>
    </main>
  );
}