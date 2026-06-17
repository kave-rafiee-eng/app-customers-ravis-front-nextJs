import { NextResponse } from "next/server";
import { AUTH_COOKIE, getAuthCookieOptions } from "@/lib/auth-cookie";

export async function POST(request: Request) {
  const response = NextResponse.json({ success: true });
  response.cookies.set(AUTH_COOKIE, "", {
    ...getAuthCookieOptions(request),
    maxAge: 0,
  });
  return response;
}
