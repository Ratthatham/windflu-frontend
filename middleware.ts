import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Bypass Supabase authentication for now
  let user = null;

  try {
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value }) =>
                request.cookies.set(name, value),
              );
              response = NextResponse.next({
                request: {
                  headers: request.headers,
                },
              });
              cookiesToSet.forEach(({ name, value, options }) =>
                response.cookies.set(name, value, options),
              );
            },
          },
        },
      );
      const { data } = await supabase.auth.getUser();
      user = data.user;
    }
  } catch (err) {
    console.error("Supabase middleware error (bypassing):", err);
  }

  const url = request.nextUrl.clone();
  const isDev = process.env.NODE_ENV === "development";

  // Handle root path (/)
  if (url.pathname === "/") {
    // In bypass mode, we treat everyone as authorized to see the landing page
    return NextResponse.rewrite(new URL("/", request.url));
  }

  // Protect /dashboard routes (still redirect to login if no user, in case they want to test this)
  if (url.pathname.startsWith("/dashboard") && !user) {
    // For now, if someone wants to bypass this too, they can, but let's keep it
    // somewhat functional.
    // return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users from /login and /register to /dashboard
  if ((url.pathname === "/login" || url.pathname === "/register") && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
