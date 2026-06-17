import { NextResponse } from "next/server";
import { AUTH_COOKIE, getAuthCookieOptions } from "@/lib/auth-cookie";

export async function POST(request: Request) {
    const { password } = await request.json();
    const validPassword = process.env.ADMIN_PASSWORD ?? "admin";

    if (password !== validPassword) {
        return NextResponse.json(
            { error: "invalid password" },
            { status: 401 },
        );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(AUTH_COOKIE, "true", getAuthCookieOptions(request));

    return response;
}
