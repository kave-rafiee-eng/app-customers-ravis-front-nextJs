const AUTH_COOKIE = "auth";

function isSecureRequest(request: Request) {
    const forwardedProto = request.headers.get("x-forwarded-proto");
    if (forwardedProto) {
        return forwardedProto.split(",")[0].trim() === "https";
    }

    return new URL(request.url).protocol === "https:";
}

export function getAuthCookieOptions(request: Request) {
    return {
        httpOnly: true,
        secure: isSecureRequest(request),
        sameSite: "lax" as const,
        path: "/",
        maxAge: 60 * 60 * 24,
    };
}

export { AUTH_COOKIE };
