import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Ambil host dan origins dari header untuk debugging
  const host = request.headers.get("host") || ""
  const origin = request.headers.get("origin") || ""
  const referer = request.headers.get("referer") || ""
  
  // Support untuk localhost (development) dan domain production
  const localhostMatch = host.match(/^([^.]+)\.(localhost|lvh\.me)(:\d+)?$/)
  const productionMatch = host.match(/^([^.]+)\.kebuncuan\.com$/)
  
  const subdomain = localhostMatch ? localhostMatch[1] : 
                   productionMatch ? productionMatch[1] : null
  
  const url = request.nextUrl
  
  // Log untuk debugging
  console.log('========================')
  console.log('Middleware invoked')
  console.log('Host:', host)
  console.log('Origin:', origin)
  console.log('Referer:', referer)
  console.log('Original path:', url.pathname)
  console.log('Subdomain detected:', subdomain)
  
  // Tambahkan log environment variables
  console.log('ENV - NEXT_PUBLIC_HOST_DOMAIN:', process.env.NEXT_PUBLIC_HOST_DOMAIN)
  console.log('ENV - NEXT_PUBLIC_ENABLE_SUBDOMAINS:', process.env.NEXT_PUBLIC_ENABLE_SUBDOMAINS)
  
  if (subdomain && subdomain !== "www") {
    // Rewrite berdasarkan path
    const originalPath = url.pathname
    
    if (url.pathname === "/" || url.pathname === "/home") {
      // Root atau /home diarahkan ke /domain/[store]/home
      url.pathname = `/domain/${subdomain}/home`
    } else {
      // Path lain diarahkan ke /domain/[store][pathname]
      url.pathname = `/domain/${subdomain}${url.pathname}`
    }
    
    console.log(`Rewriting: ${originalPath} -> ${url.pathname}`)
    console.log('========================')
    return NextResponse.rewrite(url)
  }
  
  console.log('No subdomain rewrite applied')
  console.log('========================')
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
}
