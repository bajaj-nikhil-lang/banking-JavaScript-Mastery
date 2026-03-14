"use server";

// chatgpt code
// import { NextResponse } from "next/server";
// import { createSessionClient } from "@/lib/appwrite";

// export async function GET() {
//   try {
//     // 1. Initialize Appwrite session client
//     const { account } = await createSessionClient();

//     // 2. Delete the current Appwrite session
//     await account.deleteSession("current");

//     // 3. Prepare the response and clear the cookie
//     const response = NextResponse.json({ success: true });
//     response.cookies.set({
//       name: "appwrite-session",
//       value: "",
//       path: "/",
//       httpOnly: true,
//       secure: true,
//       sameSite: "strict",
//       maxAge: 0, // ← deletes the cookie
//     });

//     return response;
//   } catch (error) {
//     console.error("Logout error:", error);
//     return NextResponse.json({ success: false });
//   }
// }


import { createSessionClient } from "@/lib/appwrite";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Initialize Appwrite session client
    const { account } = await createSessionClient();

    // 1. Get the current session
    const user = await account.get();

    // 2. Only delete session if user exists
    if (user) {
      await account.deleteSession("current");
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Logout error:", error);

    // If it's a "guest" or missing scope, still return success so frontend doesn't break
    if (
      error.code === 401 &&
      error.message.includes("missing scopes")
    ) {
      return NextResponse.json({ success: true, message: "Guest session" });
    }

    return NextResponse.json({ success: false, message: error.message });
  }
}

