// packages/client/lib/emailService.ts
import nodemailer from 'nodemailer';

export interface MeetingInviteData {
  title: string;
  date: Date;
  time: string;
  googleMeetLink: string;
  organizerEmail: string;
  organizerName: string;
  participantEmail: string;
  participantName: string;
  description?: string;
}

export class EmailService {
  private transporter;

  constructor() {
    // Configure your email transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMeetingInvitation(data: MeetingInviteData): Promise<boolean> {
    try {
      const {
        title,
        date,
        time,
        googleMeetLink,
        organizerEmail,
        organizerName,
        participantEmail,
        participantName,
        description,
      } = data;

      const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const emailHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Meeting Invitation: ${title}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4285f4; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
            .meeting-details { background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .button { display: inline-block; background-color: #4285f4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px 5px; }
            .button:hover { background-color: #3367d6; }
            .meet-button { background-color: #0f9d58; }
            .meet-button:hover { background-color: #0b8043; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📅 Meeting Invitation</h1>
              <h2>${title}</h2>
            </div>
            <div class="content">
              <p>Hello ${participantName},</p>
              <p>You have been invited to a meeting by <strong>${organizerName}</strong>.</p>
              
              <div class="meeting-details">
                <h3>Meeting Details:</h3>
                <p><strong>📋 Title:</strong> ${title}</p>
                <p><strong>📅 Date:</strong> ${formattedDate}</p>
                <p><strong>🕒 Time:</strong> ${time}</p>
                ${description ? `<p><strong>📝 Description:</strong> ${description}</p>` : ''}
                <p><strong>👥 Organizer:</strong> ${organizerName} (${organizerEmail})</p>
              </div>

              <div style="text-align: center; margin: 20px 0;">
                <a href="${googleMeetLink}" class="button meet-button">🎥 Join Google Meet</a>
                <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${date.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${new Date(date.getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(description || '')}&location=${encodeURIComponent(googleMeetLink)}" class="button">📅 Add to Calendar</a>
              </div>

              <div style="border-top: 1px solid #ddd; padding-top: 15px; margin-top: 20px;">
                <p><strong>Meeting Link:</strong> <a href="${googleMeetLink}">${googleMeetLink}</a></p>
                <p style="font-size: 12px; color: #666;">
                  💡 <strong>Tip:</strong> Make sure you have a stable internet connection and test your camera/microphone before the meeting.
                </p>
              </div>

              <p>Looking forward to meeting with you!</p>
              <p>Best regards,<br>${organizerName}</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const emailText = `
        Meeting Invitation: ${title}
        
        Hello ${participantName},
        
        You have been invited to a meeting by ${organizerName}.
        
        Meeting Details:
        - Title: ${title}
        - Date: ${formattedDate}
        - Time: ${time}
        ${description ? `- Description: ${description}` : ''}
        - Organizer: ${organizerName} (${organizerEmail})
        
        Join the meeting: ${googleMeetLink}
        
        Add to your calendar: https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${date.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${new Date(date.getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(description || '')}&location=${encodeURIComponent(googleMeetLink)}
        
        Looking forward to meeting with you!
        
        Best regards,
        ${organizerName}
      `;

      await this.transporter.sendMail({
        from: `"${organizerName}" <${process.env.SMTP_USER}>`,
        to: participantEmail,
        subject: `Meeting Invitation: ${title} - ${formattedDate} at ${time}`,
        text: emailText,
        html: emailHTML,
      });

      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }
}

// Simple email function for development/testing
export function createMeetingInviteText(data: MeetingInviteData): string {
  const {
    title,
    date,
    time,
    googleMeetLink,
    organizerName,
    participantName,
    description,
  } = data;

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
📅 MEETING INVITATION

Hello ${participantName},

You have been invited to a meeting by ${organizerName}.

📋 Title: ${title}
📅 Date: ${formattedDate}
🕒 Time: ${time}
${description ? `📝 Description: ${description}` : ''}

🎥 Join Google Meet: ${googleMeetLink}

📅 Add to Calendar: https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${date.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${new Date(date.getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(description || '')}&location=${encodeURIComponent(googleMeetLink)}

Looking forward to meeting with you!

Best regards,
${organizerName}
  `.trim();
}
