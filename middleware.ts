// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll().map(cookie => ({
            name: cookie.name,
            value: cookie.value,
          }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set({ name, value, ...options });
            res.cookies.set({ name, value, ...options });
          });
        },
      },
    }
  );

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
    const authPages: string[] = ["/login", "/register"];
    if (authPages.includes(pathname)) {
      const url = req.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    return res;
  }

  return res;
}
export const config = {
  matcher: [
    "/((?!api|sign-in|_next/static|_next/image|favicon.ico|images|manifest.webmanifest|sitemap.xml|sitemap.ts|robots.ts|robots.txt).*)",
  ],
};
