// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { pathname } = req.nextUrl;
  const publicRoutes = ["/", "/login", "/register"];
  if (!session) {
    if (!publicRoutes.includes(pathname)) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return res;
  } else if (session) {
    const authPages: string[] | string | any = ["/login", "/register"];
    if (authPages.includes(pathname)) {
      console.log("Auth Pages:", authPages);
      const url = req.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    return res;
  }

  if (pathname === "/login" || pathname === "/register") {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return res;
}
export const config = {
  matcher: [
    "/((?!api|sign-in|_next/static|_next/image|favicon.ico|images|manifest.webmanifest|sitemap.xml|sitemap.ts|robots.ts|robots.txt).*)",
  ],
};
