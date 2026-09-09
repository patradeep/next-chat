"use client";

import { FormEvent, useEffect, useRef } from "react";
import type { CurrentUser, Message, RegisteredUser } from "@/types/chat";
import { formatTime } from "@/lib/appwrite";

type ChatAreaProps = {
  activeRecipient: RegisteredUser | null;
  currentUser: CurrentUser | null;
  messages: Message[];
  text: string;
  isSending: boolean;
  mobileShowChat: boolean;
  onBackToUsers: () => void;
  onTextChange: (val: string) => void;
  onSendMessage: (e: FormEvent<HTMLFormElement>) => void;
  onRetryMessage?: (msg: Message) => void;
  onDeleteMessage?: (id: string) => void;
};

export function ChatArea({
  activeRecipient,
  currentUser,
  messages,
  text,
  isSending,
  mobileShowChat,
  onBackToUsers,
  onTextChange,
  onSendMessage,
  onRetryMessage,
  onDeleteMessage,
}: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (!activeRecipient) {
    return (
      <section className="flex-1 hidden md:grid place-items-center text-slate-500 text-sm">
        Select a user to start conversation
      </section>
    );
  }

  return (
    <section
      className={`flex-1 flex flex-col bg-slate-950/70 ${!mobileShowChat ? "hidden md:flex" : "flex"
        }`}
    >
      {/* Recipient Header */}
      <div className="h-16 shrink-0 border-b border-slate-800 bg-slate-900/30 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToUsers}
            className="md:hidden text-slate-400 hover:text-white"
          >
            ←
          </button>
          <div className="grid h-10 w-10 place-items-center rounded-full bg-indigo-600 font-bold text-sm">
            {activeRecipient.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">
              {activeRecipient.name}
            </h2>
            <p className="text-[11px] text-slate-400">{activeRecipient.email}</p>
          </div>
        </div>
        <span className="text-xs text-slate-500">1-on-1 Chat</span>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-center text-xs text-slate-500 py-10">
            No messages yet. Say hello to {activeRecipient.name}!
          </p>
        ) : (
          messages.map((m) => {
            const isMine = m.senderId === currentUser?.$id;
            const isFailed = m.status === "failed";
            const isSendingMsg = m.status === "sending";
            return (
              <div
                key={m.$id}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                    isFailed
                      ? "bg-rose-950/80 text-rose-200 border border-rose-800"
                      : isMine
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-900 text-slate-200 border border-slate-800"
                  }`}
                >
                  <p className="break-words">{m.text}</p>
                  <div
                    className={`mt-1 flex items-center justify-end gap-1.5 text-[10px] ${
                      isFailed
                        ? "text-rose-400"
                        : isMine
                        ? "text-indigo-200"
                        : "text-slate-500"
                    }`}
                  >
                    {isSendingMsg ? (
                      <span className="italic animate-pulse">Sending...</span>
                    ) : isFailed ? (
                      <div className="flex items-center gap-2">
                        <span>Failed to send</span>
                        {onRetryMessage && (
                          <button
                            type="button"
                            onClick={() => onRetryMessage(m)}
                            className="underline font-medium hover:text-white"
                          >
                            Retry
                          </button>
                        )}
                        {onDeleteMessage && (
                          <button
                            type="button"
                            onClick={() => onDeleteMessage(m.$id)}
                            className="hover:text-white"
                            title="Delete"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ) : (
                      <>
                        <span>{formatTime(m.$createdAt)}</span>
                        {isMine && (
                          <span
                            className={
                              m.read
                                ? "text-sky-300 font-bold tracking-tighter"
                                : "text-indigo-200/70"
                            }
                            title={m.read ? "Read" : "Sent"}
                          >
                            {m.read ? "✓✓" : "✓"}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Send Message Input */}
      <form onSubmit={onSendMessage} className="p-3 border-t border-slate-800 flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={`Message ${activeRecipient.name}...`}
          className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={isSending || !text.trim()}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {isSending ? "..." : "Send"}
        </button>
      </form>
    </section>
  );
}
