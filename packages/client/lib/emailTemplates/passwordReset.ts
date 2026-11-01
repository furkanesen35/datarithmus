function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });
}

export function createPasswordResetEmail({
  name,
  resetUrl,
}: {
  name: string;
  resetUrl: string;
}) {
  const safeName = escapeHtml(name || 'there');
  const safeUrl = escapeHtml(resetUrl);

  return {
    subject: 'Reset your Datarithmus password',
    text: `Hello ${name || 'there'},\n\nWe received a request to reset your Datarithmus password. Use the secure link below within one hour:\n\n${resetUrl}\n\nIf you did not request this, you can ignore this email. Your password will remain unchanged.\n\nDatarithmus`,
    html: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Reset your Datarithmus password</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f3f5;font-family:Arial,Helvetica,sans-serif;color:#29232d;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f3f5;padding:36px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:28px 36px;background-color:#301934;color:#ffffff;">
                <p style="margin:0;font-size:13px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">Datarithmus</p>
                <h1 style="margin:18px 0 0;font-size:26px;line-height:1.3;">Password reset</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:36px;">
                <p style="margin:0 0 18px;font-size:16px;line-height:1.6;">Hello ${safeName},</p>
                <p style="margin:0 0 26px;font-size:15px;line-height:1.7;color:#514a55;">We received a request to reset the password for your Datarithmus account. Use the button below to choose a new password. This link expires in one hour.</p>
                <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 auto 28px;">
                  <tr>
                    <td align="center" style="border-radius:8px;background-color:#301934;">
                      <a href="${safeUrl}" style="display:inline-block;padding:14px 28px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:bold;border-radius:8px;">Reset password</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#625b66;">If the button doesn’t work, copy and paste this link into your browser:</p>
                <p style="margin:0 0 24px;font-size:13px;line-height:1.6;word-break:break-all;"><a href="${safeUrl}" style="color:#51405b;">${safeUrl}</a></p>
                <div style="padding:16px;background-color:#f7f5f7;border-radius:8px;">
                  <p style="margin:0;font-size:13px;line-height:1.6;color:#625b66;">If you didn’t request a password reset, you can safely ignore this message. Your password will remain unchanged.</p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 36px;background-color:#faf9fa;border-top:1px solid #eeeaf0;">
                <p style="margin:0;font-size:12px;line-height:1.6;color:#817a85;">This is an automated security email from Datarithmus. Please do not reply.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  };
}
