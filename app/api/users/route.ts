import { NextResponse } from "next/server";
import { Client, Users } from "node-appwrite";

export async function GET() {
  const apiKey = process.env.APPWRITE_API_KEY;
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;

  if (!apiKey) {
    return NextResponse.json({
      users: [],
      error:
        "APPWRITE_API_KEY is not configured in .env.local. Add your Appwrite API key with users.read scope to list registered users.",
      missingKey: true,
    });
  }

  try {
    const client = new Client()
      .setEndpoint(endpoint || "https://fra.cloud.appwrite.io/v1")
      .setProject(project || "")
      .setKey(apiKey);

    const usersService = new Users(client);
    const response = await usersService.list();

    const users = response.users.map((user) => ({
      $id: user.$id,
      name: user.name || (user.email ? user.email.split("@")[0] : "User"),
      email: user.email || "",
      status: user.status,
    }));

    return NextResponse.json({ users });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch users";
    return NextResponse.json({ users: [], error: message }, { status: 500 });
  }
}
