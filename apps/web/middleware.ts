import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const cookie = (await cookies()).get("bofrot");

  if (req.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect("http://localhost:3000/dashboard/my-team");
  }

  if (!cookie) {
    return NextResponse.redirect("http://localhost:3000/login");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
