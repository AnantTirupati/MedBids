import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const uidCookie = request.cookies.get("medbids-uid")?.value;
  const roleCookie = request.cookies.get("medbids-role")?.value;

  const isAuthRoute = pathname.startsWith("/login") || (pathname.startsWith("/signup") && pathname !== "/signup/pharmacy");
  const isDashboardRoute = pathname.startsWith("/dashboard");

  // 1. Unauthenticated users trying to access protected dashboard routes
  if (!uidCookie) {
    if (isDashboardRoute) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 2. Authenticated users
  if (uidCookie) {
    const role = roleCookie || "patient";
    const correctDashboard = `/dashboard/${role}`;

    // Redirect authenticated users away from public auth pages (login, signup, etc.)
    if (isAuthRoute) {
      return NextResponse.redirect(new URL(correctDashboard, request.url));
    }

    // Role-based protection check within /dashboard
    if (isDashboardRoute) {
      if (pathname.startsWith("/dashboard/patient") && role !== "patient") {
        return NextResponse.redirect(new URL(correctDashboard, request.url));
      }
      if (pathname.startsWith("/dashboard/pharmacy") && role !== "pharmacy") {
        return NextResponse.redirect(new URL(correctDashboard, request.url));
      }
      if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
        return NextResponse.redirect(new URL(correctDashboard, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signup/:path*",
    "/dashboard/:path*",
  ],
};
