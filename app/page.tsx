import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl" />
      <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />

      <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Next<span className="text-indigo-400">Chat</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 hover:text-white"
          >
            Log in
          </Link>

          <Link
            href="/signup"
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            Get started
          </Link>
        </div>
      </nav>

      <section className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 pb-20 pt-16 lg:grid-cols-2 lg:pt-28">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-4 py-2 text-sm text-indigo-200">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Real-time conversations
          </div>

          <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
            Talk together,
            <span className="block text-indigo-400">instantly.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            PulseChat is a simple space to share ideas, stay connected, and
            chat with your people in real time.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="rounded-xl bg-indigo-500 px-6 py-3.5 font-semibold text-white transition hover:bg-indigo-400"
            >
              Create free account
            </Link>

            <Link
              href="/login"
              className="rounded-xl border border-slate-700 px-6 py-3.5 font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
            >
              I already have an account
            </Link>
          </div>

          <div className="mt-10 flex gap-8 text-sm text-slate-400">
            <div>
              <p className="text-xl font-bold text-white">Instant</p>
              <p>Message delivery</p>
            </div>
            <div>
              <p className="text-xl font-bold text-white">Simple</p>
              <p>One shared room</p>
            </div>
            <div>
              <p className="text-xl font-bold text-white">Secure</p>
              <p>Account required</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-5 shadow-2xl backdrop-blur">
            <div className="flex items-center gap-3 border-b border-slate-700 pb-4">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-indigo-500 font-bold">
                P
              </div>
              <div>
                <p className="font-semibold">General room</p>
                <p className="text-sm text-emerald-400">● 12 people online</p>
              </div>
            </div>

            <div className="space-y-5 py-6">
              <div className="flex gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-pink-500 text-sm font-bold">
                  A
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    Aisha <span className="font-normal text-slate-500">10:32</span>
                  </p>
                  <p className="mt-1 rounded-2xl rounded-tl-none bg-slate-800 px-4 py-2.5 text-sm text-slate-200">
                    Hey everyone! Ready to build something great?
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="max-w-[78%]">
                  <p className="mb-1 text-right text-sm font-semibold">
                    You <span className="font-normal text-slate-500">10:33</span>
                  </p>
                  <p className="rounded-2xl rounded-tr-none bg-indigo-500 px-4 py-2.5 text-sm">
                    Absolutely. Let&apos;s get started! 🚀
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-500 text-sm font-bold">
                  R
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    Rahul <span className="font-normal text-slate-500">10:34</span>
                  </p>
                  <p className="mt-1 rounded-2xl rounded-tl-none bg-slate-800 px-4 py-2.5 text-sm text-slate-200">
                    This looks amazing already.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-slate-800 p-3 text-sm text-slate-500">
              Write a message...
              <span className="ml-auto grid h-8 w-8 place-items-center rounded-lg bg-indigo-500 text-white">
                ↑
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}