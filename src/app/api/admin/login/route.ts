import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { key } = await request.json();
    const adminSecret = process.env.ADMIN_SECRET || "mawt-dev-key"; // Fallback for dev

    if (key === adminSecret) {
      const cookieStore = await cookies();
      cookieStore.set("admin-token", adminSecret, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid key" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
