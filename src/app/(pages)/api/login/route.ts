import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET as string;

if (!SECRET_KEY) {
  throw new Error("JWT_SECRET is missing in .env.local");
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (username === "admin@gmail.com" && password === "admin123") {
      // ✅ Secure JWT Token Generation
      const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1d" });

      // ✅ Set Secure Cookie
      const response = NextResponse.json({ message: "Login Successful" }, { status: 200 });
      response.cookies.set({
        name: "userToken",
        value: token,
        httpOnly: true, // 🛑 Cannot be accessed by JavaScript
        secure: process.env.NODE_ENV === "production", // Only in HTTPS
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day expiry
      });

      return response;
    }

    return NextResponse.json({ message: "Invalid Credentials" }, { status: 401 });
  } catch {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
