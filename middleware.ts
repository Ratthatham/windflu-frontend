import { NextResponse, type NextRequest } from "next/server";

// Routes that require the user to be logged in
const PROTECTED_ROUTES = ["/creator", "/brand", "/admin", "/dashboard"];

// Routes that logged-in users should NOT access
const AUTH_ROUTES = [
  "/login",
  "/register",
  "/admin/login",
  "/admin/register",
  "/brand/login",
  "/brand/register",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;
  const isAuthenticated = Boolean(token);

  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));
  const isProtectedRoute = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const role = request.cookies.get("user_role")?.value;

  // 0. Redirect /dashboard to role-specific dashboard
  if (isAuthenticated && pathname === "/dashboard") {
    if (role === "admin")
      return NextResponse.redirect(new URL("/admin/manage", request.url));
    if (role === "brand")
      return NextResponse.redirect(new URL("/brand/create-campaign", request.url));
    return NextResponse.redirect(new URL("/creator/campaigns", request.url));
  }

  // 1. If it's an auth route (login/register)
  if (isAuthRoute) {
    if (isAuthenticated) {
      // Logged in users shouldn't see login pages
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    // Allow unauthenticated users through to login
    return NextResponse.next();
  }

  // 2. Protect role-based and dashboard routes
  if (isProtectedRoute && !isAuthenticated) {
    let loginRoute = "/login";
    if (pathname.startsWith("/admin")) loginRoute = "/admin/login";
    else if (pathname.startsWith("/brand")) loginRoute = "/brand/login";

    const loginUrl = new URL(loginRoute, request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth/set-token|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
