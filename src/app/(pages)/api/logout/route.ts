import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    serialize("userToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0), // Delete cookie
      path: "/",
    })
  );

  return new NextResponse(
    JSON.stringify({ message: "Logged out" }),
    { status: 200, headers }
  );
}
