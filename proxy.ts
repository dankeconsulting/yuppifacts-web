import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0] ?? "";
  const path = request.nextUrl.pathname;
  if (path.startsWith("/_next") || path.includes(".")) return NextResponse.next();
  if (host === "app.yuppifacts.com" && path === "/") return NextResponse.rewrite(new URL("/demo", request.url));
  if (host === "admin.yuppifacts.com" && path === "/") return NextResponse.rewrite(new URL("/admin", request.url));
  if (host === "tickets.yuppifacts.com" && path === "/") return NextResponse.rewrite(new URL("/tickets", request.url));
  if (host === "promo.yuppifacts.com" && path === "/") return NextResponse.rewrite(new URL("/promo", request.url));
  return NextResponse.next();
}

export const config = { matcher: ["/:path*"] };
