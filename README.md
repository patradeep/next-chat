This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# NextChat - Real-Time 1-on-1 Chat Application

A real-time 1-on-1 chat app built with Next.js (App Router, Tailwind CSS) and Appwrite Cloud.

## Features
- Real-time messaging via Appwrite WebSocket subscription
- 1-on-1 direct conversations between registered users
- Unread message counters & real-time badge clearing
- Optimistic UI updates with offline & retry delivery handling
- Read receipts (`✓` Sent, `✓✓` Read)

---

## Appwrite Setup Guide

### 1. Project & Web Platform
1. Create a project in [Appwrite Cloud Console](https://cloud.appwrite.io).
2. Under **Overview** -> **Platforms**, click **Add Platform** -> **Web App**:
   - **Local Dev**: Hostname `localhost`
   - **Production**: Hostname `*.vercel.app` (or your custom Vercel domain).

### 2. Database & Table
1. Create a Database (e.g. `chat_db`).
2. Create a Table / Collection named `messages`.

### 3. Attributes (Columns)
Add the following attributes to the `messages` table:
- `text` (Text, size 16,383, required)
- `senderId` (String, size 255, required)
- `senderName` (String, size 100, required)
- `recipientId` (String, size 255, required)
- `read` (Boolean, default `false`, required)

### 4. Indexes
- `sender_idx`: Key `senderId`, Type `Key`
- `recipient_idx`: Key `recipientId`, Type `Key`

### 5. Table Permissions
In Table **Settings** -> **Permissions**, grant the following to `Users` (Role: `users`):
- **Create**: Checked
- **Read**: Checked
- **Update**: Checked (required for recipients to mark messages as read)

### 6. API Key (Server-Side User Directory)
1. In Appwrite Console, go to **Overview** -> **Integrations** -> **API Keys**.
2. Create an API key with the scope:
   - `users.read` (allows `/api/users` route to fetch registered users).
