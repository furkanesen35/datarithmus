import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

// POST /api/auth/request-password-reset { email }
export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
  await prisma.passwordResetToken.create({
    data: { userId: user.id, token, expiresAt },
  });
  // In production, send email. For now, log the reset link:
  console.log(`Password reset link: http://localhost:3000/auth/reset-password?token=${token}`);
  return NextResponse.json({ message: "Password reset link sent (check server log)" });
}
