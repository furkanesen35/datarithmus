import nodemailer from 'nodemailer';

export interface MailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendMail({
  to,
  subject,
  html,
  text,
}: MailMessage) {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP_HOST, SMTP_USER, and SMTP_PASS must be configured.');
  }

  const port = Number(process.env.SMTP_PORT || 587);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('SMTP_PORT must be a valid port number.');
  }

  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === 'true'
    : port === 465;

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `Datarithmus <${SMTP_USER}>`,
    to,
    subject,
    html,
    text,
  });
}
