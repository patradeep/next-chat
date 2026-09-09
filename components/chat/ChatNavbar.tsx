"use client";

import type { CurrentUser } from "@/types/chat";

export function ChatNavbar({
  user,
  onLogout,
}: {
  user: CurrentUser | null;
  onLogout: () => void;
}) {
  return (
    <header className="h-16 shrink-0 border-b border-slate-800 bg-slate-900/60 px-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="font-bold text-base text-white">NextChat</span>
        <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-medium">
          1-on-1
        </span>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <span className="text-xs text-slate-400 hidden sm:inline">
            Logged in as <strong className="text-slate-200">{user.name}</strong>
          </span>
        )}
        <button
          onClick={onLogout}
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
