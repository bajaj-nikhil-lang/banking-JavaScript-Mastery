"use server";

// chatgpt code
import { NextResponse } from "next/server";
import { createSessionClient } from "@/lib/appwrite";

export async function GET() {
  try {
    // 1. Initialize Appwrite session client
    const { account } = await createSessionClient();

    // 2. Delete the current Appwrite session
    await account.deleteSession("current");

    // 3. Prepare the response and clear the cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: "appwrite-session",
      value: "",
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 0, // ← deletes the cookie
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ success: false });
  }
}
