import { NextRequest, NextResponse } from "next/server";

// wiki.argh.space/<x>  ->  /wiki/<x>   (admin, api e asset restano invariati)
export function proxy(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const { pathname } = req.nextUrl;
  if (host.startsWith("wiki.") && !/^\/(admin|wiki|privacy|cookie|_next|api)(\/|$)/.test(pathname) && !pathname.includes(".")) {
    const url = req.nextUrl.clone();
    url.pathname = "/wiki" + (pathname === "/" ? "" : pathname);
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
