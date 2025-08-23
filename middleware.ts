import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || ""
  // Ambil subdomain sebelum .localhost atau .lvh.me
  const match = host.match(/^([^.]+)\.(localhost|lvh\.me)(:\d+)?$/)
  const subdomain = match ? match[1] : null
  const url = request.nextUrl
  
  if (subdomain && subdomain !== "www") {
    // Rewrite berdasarkan path
    if (url.pathname === "/" || url.pathname === "/home") {
      // Root atau /home diarahkan ke /domain/[store]/home
      url.pathname = `/domain/${subdomain}/home`
    } else {
      // Path lain diarahkan ke /domain/[store][pathname]
      url.pathname = `/domain/${subdomain}${url.pathname}`
    }
    return NextResponse.rewrite(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
}
