"use server";

import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../utils";
import { NextResponse } from "next/server";

export const signIn = async ({ email, password }: signInProps) => {
    try {
        // Mutation / Database / Make fetch
        const { account } = await createAdminClient();

        // const response = await account.createEmailPasswordSession(email, password);
        const session = await account.createEmailPasswordSession(email, password);

        // chatgpt code from here
        const cookieStore = await cookies();

        cookieStore.set("appwrite-session", session.secret, {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          secure: true,
        });
        // chatgpt code upto abovwe

        // return parseStringify(response);
        return parseStringify(session);
    } catch (error) {
        console.log('Error ', error);
    }
}

export const signUp = async (userData: SignUpParams) => {
    const { email, password, firstName, lastName } = userData;
    
    try {
        // Mutation / Database / Make fetch
        // Create a user account

        const { account } = await createAdminClient();

        // const newUserAccount = await account.create({
        //     userId: ID.unique(),
        //     email,
        //     password,
        //     `${firstName} ${lastName}`
        // });

        // chatgpt code
        const newUserAccount = await account.create(
            ID.unique(),
            email,
            password,
            `${firstName} ${lastName}`
        );

        const session = await account.createEmailPasswordSession(email, password);

        // cookies().set("appwrite-session", session.secret, {
        const cookieStore = await cookies();

        cookieStore.set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        return parseStringify(newUserAccount);
    } catch (error) {
        console.log('Error ', error);
        // chatgpt code
        throw error; // ← important
    }
}

// ... your initilization functions

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    // return await account.get();
    const user = await account.get();

    console.log("Logged in user from Appwrite:", user);

    return parseStringify(user);
  } catch (error) {
    // console.log("getLoggedInUser error:", error);
    // return null;
    if (error) {
      console.log("No logged-in user, returning null for guest");
      return null;
    }
    console.error("getLoggedInUser unexpected error:", error);
    return null;
  }
}

// ==================================================

// export const logoutAccount = async () => {
//     try {
//         const { account } = await createSessionClient();

//         cookies().delete('appwrite-session');

//         account.deleteSession('current');
//     } catch (error) {
//         return null;
//     }
// }

// **************************************************

// export const logoutAccount = async () => {
//   try {
//     const { account } = await createSessionClient();

//     // `cookies()` returns a Promise<ReadonlyRequestCookies> which is read-only
//     // To delete, use `cookies().delete` on the server response object
//     const cookieStore = cookies(); // do NOT await
//     cookieStore.set({
//       name: "appwrite-session",
//       value: "",
//       path: "/",
//       httpOnly: true,
//       secure: true,
//       sameSite: "strict",
//       maxAge: 0, // ← this deletes the cookie
//     });

//     // Optionally, also log out the Appwrite session
//     await account.deleteSession("current");

//     return true;
//   } catch (error) {
//     console.log("Logout error:", error);
//     return false;
//   }
// };

// **************************************************

// export const logoutAccount = async () => {
//   try {
//     const { account } = await createSessionClient();

//     // Use cookies() synchronously — do NOT await
//     const cookieStore = cookies();

//     // Delete cookie by setting maxAge to 0
//     cookieStore.set({
//       name: "appwrite-session",
//       value: "",
//       path: "/",
//       httpOnly: true,
//       secure: true,
//       sameSite: "strict",
//       maxAge: 0,
//     });

//     // Delete Appwrite session
//     await account.deleteSession("current");

//     return true;
//   } catch (error) {
//     console.log("Logout error:", error);
//     return false;
//   }
// };

// **************************************************

// export const logoutAccount = async () => {
//   try {
//     const { account } = await createSessionClient();

//     // Delete Appwrite session server-side
//     await account.deleteSession('current');

//     // Create a response that clears the cookie
//     const response = NextResponse.json({ success: true });

//     response.cookies.set({
//       name: 'appwrite-session',
//       value: '',
//       maxAge: 0,
//       path: '/',
//       httpOnly: true,
//       secure: true,
//       sameSite: 'strict',
//     });

//     return response; // send back to client
//   } catch (error) {
//     console.log('Logout error:', error);
//     return NextResponse.json({ success: false });
//   }
// };

// **************************************************

export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();

    // Delete the Appwrite session
    await account.deleteSession("current");

    // Create a response that clears the cookie
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
    console.log("Logout error:", error);
    return NextResponse.json({ success: false });
  }
};