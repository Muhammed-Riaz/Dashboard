import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // ✅ Middleware Trigger Log
  console.log("🔍 Middleware Triggered!");

  // ✅ Read Cookies from Headers
  const cookieHeader = req.headers.get("cookie") || "";
  const userToken = cookieHeader
    .split("; ")
    .find((row) => row.startsWith("userToken="))
    ?.split("=")[1];

  console.log("🔑 User Token:", userToken); // Check if token is found
  console.log("🌐 Current Path:", req.nextUrl.pathname); // Current Path

  // Protected Routes List
  const protectedRoutes = ["/", "/orders", "/products", "/customers"];

  // 🔺 Agar `/` pe aaye aur login nahi hai, toh `/login` pe bhejo
  if (req.nextUrl.pathname === "/" && !userToken) {
    console.log("🚫 User Not Logged In on /! Redirecting to /login...");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔺 Protected Routes Access Control
  if (protectedRoutes.includes(req.nextUrl.pathname) && !userToken) {
    console.log("🚫 User Not Logged In! Redirecting to /login...");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  console.log("✅ Access Allowed");
  return NextResponse.next(); // Allow the request
}

// ✅ Apply Middleware on These Routes
export const config = {
  matcher: ["/", "/orders", "/products", "/customers"],
};
