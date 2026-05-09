import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const NEXTAUTH_COOKIES = [
  "next-auth.session-token",
  "next-auth.csrf-token",
  "next-auth.callback-url",
  "__Secure-next-auth.session-token",
  "__Host-next-auth.csrf-token",
  "__Secure-next-auth.callback-url",
];

async function handleLogout(_request: NextRequest) {
  const cookieStore = await cookies();

  // Invalidate the JWT on the Payload side
  const payloadToken =
    cookieStore.get("payload-token")?.value ||
    cookieStore.get("paylaod-token")?.value;
  if (payloadToken) {
    try {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://surge-backend-seven.vercel.app';
      await fetch(`${serverUrl}/api/users/logout`, {
        method: "POST",
        headers: {
          Authorization: `JWT ${payloadToken}`,
          "Content-Type": "application/json",
        },
      });
    } catch (e) {
      console.error("Payload logout error:", e);
    }
  }

  const response = NextResponse.json({ success: true });

  // Explicitly kill the non-httpOnly js-cookie version of payload-token.
  // The server cannot read non-httpOnly cookies sent in request headers the
  // same way, so we target it by setting it to empty with maxAge:0 and
  // httpOnly:false to match the attributes js-cookie used when it was set.
  response.cookies.set("payload-token", "", {
    maxAge: 0,
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  // Clear every cookie the server can see
  const allCookies = cookieStore.getAll();
  allCookies.forEach(({ name }) => {
    // Delete via cookieStore (mutates Set-Cookie header)
    cookieStore.delete(name);
    // Also force-expire via response headers to guarantee removal
    response.cookies.set(name, "", {
      maxAge: 0,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  });

  // Explicitly nuke all known NextAuth cookie names even if they
  // weren't visible in the current request (e.g. different path/prefix)
  NEXTAUTH_COOKIES.forEach((name) => {
    response.cookies.set(name, "", {
      maxAge: 0,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  });

  return response;
}

export async function GET(request: NextRequest) {
  return handleLogout(request);
}

export async function POST(request: NextRequest) {
  return handleLogout(request);
}
