import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function requireSuperuser(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as {
      email: string;
      isSuperuser: boolean;
    };
    if (!decoded.isSuperuser) {
      return NextResponse.json({ error: "Superuser access required" }, { status: 403 });
    }
    return null; // Proceed
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}