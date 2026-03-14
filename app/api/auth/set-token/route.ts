import { NextResponse } from "next/server";

/**
 * POST /api/auth/set-token
 * Called from the login page after a successful API login.
 * Stores access_token as a readable cookie (js-cookie can read it client-side)
 * while refresh_token stays httpOnly for security.
 * The Next.js middleware reads cookies server-side regardless of httpOnly flag.
 */
export async function POST(request: Request) {
  const body = await request.json();

  // Accept multiple field name formats from different backend responses
  const access_token = body.access_token || body.token || body.accessToken;
  const refresh_token = body.refresh_token || body.refreshToken;
  const role = body.role;
  const user_id = body.user_id || body.userId;

  if (!access_token) {
    console.error(
      "set-token: no access_token found in body",
      JSON.stringify(body),
    );
    return NextResponse.json(
      { error: "access_token required", received: Object.keys(body) },
      { status: 400 },
    );
  }

  const res = NextResponse.json({ ok: true });

  const base = {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };

  // Readable by js-cookie on client — middleware reads it server-side anyway
  res.cookies.set("access_token", access_token, {
    ...base,
    maxAge: 60 * 60 * 24,
  });

  // Refresh token stays httpOnly — only used by internal Next.js routes
  if (refresh_token) {
    res.cookies.set("refresh_token", refresh_token, {
      ...base,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  if (role)
    res.cookies.set("user_role", role, { ...base, maxAge: 60 * 60 * 24 });
  if (user_id)
    res.cookies.set("user_id", user_id, { ...base, maxAge: 60 * 60 * 24 });

  return res;
}

/**
 * DELETE /api/auth/set-token
 * Clears auth cookies (logout).
 */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("access_token");
  res.cookies.delete("refresh_token");
  res.cookies.delete("user_role");
  res.cookies.delete("user_id");
  return res;
}
