import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") || "";

  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const subdomain = host.split(".")[0];
  const isLocalhost = host.includes("localhost");
  const isRootDomain = subdomain === "www" || subdomain === "app" || isLocalhost;

  if (isRootDomain) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${subdomain}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
