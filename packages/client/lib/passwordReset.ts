import crypto from 'crypto';
import { PrismaClient, User } from '@prisma/client';
import { createPasswordResetEmail } from './emailTemplates/passwordReset';
import { sendMail } from './mail';

export async function sendPasswordResetEmail(
  prisma: PrismaClient,
  user: Pick<User, 'id' | 'email' | 'username'>,
  baseUrl: string,
): Promise<void> {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
  await prisma.passwordResetToken.create({
    data: { userId: user.id, token, expiresAt },
  });

  const resetUrl = `${baseUrl}/auth/reset-password#token=${token}`;
  const email = createPasswordResetEmail({
    name: user.username,
    resetUrl,
  });

  try {
    await sendMail({
      to: user.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
    });
  } catch (error) {
    await prisma.passwordResetToken.update({
      where: { token },
      data: { used: true },
    });
    throw error;
  }
}
