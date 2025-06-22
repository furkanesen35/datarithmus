import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// GET /api/admins - returns a list of admin users (isSuperuser=true)
export async function GET() {
  try {
    const admins = await prisma.user.findMany({
      where: { isSuperuser: true },
      select: { id: true, email: true, username: true },
    });
    return NextResponse.json({ admins });
  } catch {
    return NextResponse.json({ error: "Failed to fetch admins" }, { status: 500 });
  }
}
