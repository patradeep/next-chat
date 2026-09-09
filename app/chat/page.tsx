"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  account,
  Channel,
  ID,
  Permission,
  Query,
  realtime,
  Role,
  tablesDB,
} from "@/lib/appwrite";
import type { CurrentUser, Message, RegisteredUser } from "@/types/chat";
import { ChatNavbar } from "@/components/chat/ChatNavbar";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatArea } from "@/components/chat/ChatArea";

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
const tableId = process.env.NEXT_PUBLIC_APPWRITE_MESSAGES_TABLE!;

export default function ChatPage() {
  const router = useRouter();

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [usersList, setUsersList] = useState<RegisteredUser[]>([]);
  const [activeRecipient, setActiveRecipient] = useState<RegisteredUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);

  useEffect(() => {
    let isActive = true;
    let subscription: { unsubscribe: () => Promise<void> | void } | undefined;

    async function initChat() {
      try {
        // 1. Authenticated User
        const current = await account.get();
        if (!isActive) return;
        setUser({
          $id: current.$id,
          name: current.name || current.email.split("@")[0],
          email: current.email,
        });

        // 2. Other Registered Users
        const usersRes = await fetch("/api/users");
        const usersData = await usersRes.json();
        const others = (usersData.users || []).filter(
          (u: RegisteredUser) => u.$id !== current.$id,
        );
        if (isActive) {
          setUsersList(others);
          if (others.length > 0) setActiveRecipient(others[0]);
        }

        // 3. Existing Messages
        const res = await tablesDB.listRows<Message>({
          databaseId,
          tableId,
          queries: [Query.limit(100)],
        });
        if (!isActive) return;
        setMessages(res.rows);
        setIsLoading(false);

        // 4. Real-time Subscription (listen for new messages and read updates)
        subscription = await realtime.subscribe<Message>(
          [
            Channel.tablesdb(databaseId).table(tableId).row().create(),
            Channel.tablesdb(databaseId).table(tableId).row().update(),
          ],
          (event) => {
            const newMsg = event.payload;
            setMessages((prev) => {
              const exists = prev.some((m) => m.$id === newMsg.$id);
              return exists
                ? prev.map((m) => (m.$id === newMsg.$id ? newMsg : m))
                : [...prev, newMsg];
            });
          },
        );
      } catch (err) {
        console.error("[Chat Init Error]:", err);
        router.replace("/login");
      }
    }

    void initChat();
    return () => {
      isActive = false;
      subscription?.unsubscribe();
    };
  }, [router]);

  // Filter 1-on-1 messages for active conversation
  const activeConversationMessages = useMemo(() => {
    if (!user || !activeRecipient) return [];
    return messages.filter(
      (m) =>
        (m.senderId === user.$id && m.recipientId === activeRecipient.$id) ||
        (m.senderId === activeRecipient.$id && m.recipientId === user.$id),
    );
  }, [messages, user, activeRecipient]);

  // Automatically mark incoming messages as read when viewing this conversation
  useEffect(() => {
    if (!user || !activeRecipient) return;

    const unread = messages.filter(
      (m) => m.senderId === activeRecipient.$id && m.recipientId === user.$id && !m.read,
    );

    if (unread.length === 0) return;

    // 1. Clear unread in local state
    const unreadIds = new Set(unread.map((m) => m.$id));
    queueMicrotask(() => {
      setMessages((prev) =>
        prev.map((m) => (unreadIds.has(m.$id) ? { ...m, read: true } : m)),
      );
    });

    // 2. Persist read: true to Appwrite
    unread.forEach((msg) =>
      tablesDB
        .updateRow({ databaseId, tableId, rowId: msg.$id, data: { read: true } })
        .catch((err) => console.error("Error marking message read:", err)),
    );
  }, [activeRecipient, messages, user]);

  // Core sender used for both initial send and retry
  async function submitMessage(msgText: string, tempId: string) {
    if (!user || !activeRecipient) return;
    setIsSending(true);
    try {
      const newRow = await tablesDB.createRow<Message>({
        databaseId,
        tableId,
        rowId: tempId,
        data: {
          text: msgText,
          senderId: user.$id,
          senderName: user.name,
          recipientId: activeRecipient.$id,
          read: false,
        },
        permissions: [
          Permission.read(Role.users()),
          Permission.update(Role.users()),
        ],
      });
      // Success: mark as sent
      setMessages((prev) =>
        prev.map((m) => (m.$id === tempId ? { ...newRow, status: "sent" } : m)),
      );
    } catch {
      // Offline/failure: mark as failed for 1-click retry
      setMessages((prev) =>
        prev.map((m) => (m.$id === tempId ? { ...m, status: "failed" } : m)),
      );
    } finally {
      setIsSending(false);
    }
  }

  async function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const cleanText = text.trim();
    if (!cleanText || !user || !activeRecipient) return;

    const tempId = ID.unique();
    const optimistic = {
      $id: tempId,
      $createdAt: new Date().toISOString(),
      text: cleanText,
      senderId: user.$id,
      senderName: user.name,
      recipientId: activeRecipient.$id,
      read: false,
      status: "sending",
    } as Message;

    // Show immediately in UI and clear input
    setMessages((prev) => [...prev, optimistic]);
    setText("");
    await submitMessage(cleanText, tempId);
  }

  async function retryMessage(failedMsg: Message) {
    setMessages((prev) =>
      prev.map((m) => (m.$id === failedMsg.$id ? { ...m, status: "sending" } : m)),
    );
    await submitMessage(failedMsg.text, failedMsg.$id);
  }

  async function logout() {
    await account.deleteSession({ sessionId: "current" });
    router.replace("/login");
  }

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 text-slate-400 text-sm">
        Loading chat...
      </main>
    );
  }

  return (
    <main className="h-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col">
      <ChatNavbar user={user} onLogout={logout} />
      <div className="flex-1 flex overflow-hidden">
        <ChatSidebar
          users={usersList}
          activeRecipient={activeRecipient}
          currentUser={user}
          messages={messages}
          mobileShowChat={mobileShowChat}
          onSelectUser={(u) => {
            setActiveRecipient(u);
            setMobileShowChat(true);
          }}
        />
        <ChatArea
          activeRecipient={activeRecipient}
          currentUser={user}
          messages={activeConversationMessages}
          text={text}
          isSending={isSending}
          mobileShowChat={mobileShowChat}
          onBackToUsers={() => setMobileShowChat(false)}
          onTextChange={setText}
          onSendMessage={sendMessage}
          onRetryMessage={retryMessage}
          onDeleteMessage={(id: string) => setMessages((prev) => prev.filter((m) => m.$id !== id))}
        />
      </div>
    </main>
  );
}