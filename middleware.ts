import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  console.log("✅ Middleware Triggered:", req.nextUrl.pathname)

  const token = req.cookies.get("token")?.value

  // agar token nahi mila → login page pe redirect
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // warna allow
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/sales/:path*",
    "/products/:path*",
    "/purchases/:path*",
    "/reports/:path*",
    "/customers/:path*",
    "/supplier/:path*",
  ],
}
