import type { Models } from "appwrite";

export type Message = Models.Row & {
  text: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  read: boolean;
  status?: "sending" | "sent" | "failed";
};

export type User = {
  $id: string;
  name: string;
  email: string;
};

export type CurrentUser = User;
export type RegisteredUser = User;

