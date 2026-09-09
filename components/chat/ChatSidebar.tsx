"use client";

import type { CurrentUser, Message, RegisteredUser } from "@/types/chat";
import { formatTime } from "@/lib/appwrite";

type ChatSidebarProps = {
  users: RegisteredUser[];
  activeRecipient: RegisteredUser | null;
  currentUser: CurrentUser | null;
  messages: Message[];
  mobileShowChat: boolean;
  onSelectUser: (user: RegisteredUser) => void;
};

export function ChatSidebar({
  users,
  activeRecipient,
  currentUser,
  messages,
  mobileShowChat,
  onSelectUser,
}: ChatSidebarProps) {
  return (
    <aside
      className={`w-full md:w-80 shrink-0 border-r border-slate-800 bg-slate-900/40 flex flex-col ${
        mobileShowChat ? "hidden md:flex" : "flex"
      }`}
    >
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
        <span>Users ({users.length})</span>
        <span className="text-[10px] text-indigo-400 lowercase font-normal">
          select to chat
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {users.length === 0 ? (
          <p className="p-4 text-center text-xs text-slate-500">
            No other users registered yet.
          </p>
        ) : (
          users.map((u) => {
            const isSelected = activeRecipient?.$id === u.$id;

            // Simple calculation: count messages sent by this user to me that are unread
            const unreadCount = messages.filter(
              (m) => m.senderId === u.$id && m.recipientId === currentUser?.$id && !m.read,
            ).length;

            const conversationMessages = messages.filter(
              (m) =>
                (m.senderId === currentUser?.$id && m.recipientId === u.$id) ||
                (m.senderId === u.$id && m.recipientId === currentUser?.$id),
            );
            const lastMsg = conversationMessages[conversationMessages.length - 1];

            return (
              <button
                key={u.$id}
                onClick={() => onSelectUser(u)}
                className={`w-full flex items-center gap-3 rounded-xl p-3 text-left transition ${
                  isSelected
                    ? "bg-indigo-600/15 border border-indigo-500/30 text-white"
                    : unreadCount > 0
                    ? "bg-slate-800/60 hover:bg-slate-800/80 border border-indigo-500/20 text-white"
                    : "text-slate-300 hover:bg-slate-800/40 border border-transparent"
                }`}
              >
                <div className="relative shrink-0">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-indigo-600 text-white font-bold text-sm">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  {/* Unread indicator dot */}
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500 border-2 border-slate-900"></span>
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p
                      className={`truncate text-xs ${
                        unreadCount > 0 ? "font-bold text-white" : "font-semibold"
                      }`}
                    >
                      {u.name}
                    </p>
                    {lastMsg && (
                      <span
                        className={`text-[10px] ${
                          unreadCount > 0 ? "font-semibold text-indigo-400" : "text-slate-500"
                        }`}
                      >
                        {formatTime(lastMsg.$createdAt)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p
                      className={`truncate text-[11px] ${
                        unreadCount > 0 ? "font-medium text-slate-200" : "text-slate-400"
                      }`}
                    >
                      {lastMsg ? lastMsg.text : u.email}
                    </p>
                    {/* Exact unread count badge */}
                    {unreadCount > 0 && (
                      <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[10px] font-bold text-white shadow-sm">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
