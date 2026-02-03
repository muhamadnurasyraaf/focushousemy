import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_LOGIN,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_LOGIN,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}

export async function sendBookingApprovedEmail(
  customerEmail: string,
  customerName: string,
  studioName: string,
  startTime: Date,
  endTime: Date,
) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #000; color: white; padding: 30px 20px; text-align: center; }
          .content { padding: 30px 20px; background-color: #f9f9f9; }
          .session-details { background-color: white; padding: 20px; margin: 20px 0; border-left: 4px solid #000; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
          .button { display: inline-block; padding: 12px 30px; background-color: #000; color: white; text-decoration: none; border-radius: 25px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Photography Session Confirmed!</h1>
          </div>
          <div class="content">
            <p>Dear ${customerName},</p>
            <p>Great news! Your photography session has been confirmed by our photographer.</p>
            <div class="session-details">
              <h3>Session Details:</h3>
              <p><strong>Package:</strong> ${studioName}</p>
              <p><strong>Date & Time:</strong> ${new Date(startTime).toLocaleString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
              <p><strong>Expected Duration:</strong> ${Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60))} minutes</p>
            </div>
            <p><strong>What to Prepare:</strong></p>
            <ul>
              <li>Arrive 10-15 minutes early</li>
              <li>Wear comfortable clothing appropriate for your session type</li>
              <li>Bring any props or items discussed</li>
              <li>Come with a smile and positive energy!</li>
            </ul>
            <p>If you have any questions or need to reschedule, please contact us as soon as possible.</p>
            <p>We look forward to capturing your special moments!</p>
          </div>
          <div class="footer">
            <p>FocusHouse Photography</p>
            <p>Capturing Your Perfect Moment</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: customerEmail,
    subject: "Photography Session Confirmed - FocusHouse",
    html,
  });
}

export async function sendBookingCancelledEmail(
  customerEmail: string,
  customerName: string,
  studioName: string,
  startTime: Date,
  endTime: Date,
  reason?: string,
) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #444; color: white; padding: 30px 20px; text-align: center; }
          .content { padding: 30px 20px; background-color: #f9f9f9; }
          .session-details { background-color: white; padding: 20px; margin: 20px 0; border-left: 4px solid #666; }
          .reason-box { background-color: #fff3cd; padding: 15px; margin: 20px 0; border-left: 4px solid #ffc107; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Session Cancelled</h1>
          </div>
          <div class="content">
            <p>Dear ${customerName},</p>
            <p>We regret to inform you that your photography session has been cancelled.</p>
            <div class="session-details">
              <h3>Cancelled Session Details:</h3>
              <p><strong>Package:</strong> ${studioName}</p>
              <p><strong>Scheduled Date:</strong> ${new Date(startTime).toLocaleString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
            </div>
            ${
              reason
                ? `
            <div class="reason-box">
              <h4 style="margin-top: 0;">Reason for Cancellation:</h4>
              <p>${reason}</p>
            </div>
            `
                : ""
            }
            <p>We apologize for any inconvenience this may cause. If you'd like to reschedule or book a different session, we'd be happy to help you find a new time that works for you.</p>
            <p>Please feel free to contact us if you have any questions or would like to discuss alternative dates.</p>
          </div>
          <div class="footer">
            <p>FocusHouse Photography</p>
            <p>Capturing Your Perfect Moment</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: customerEmail,
    subject: "Photography Session Cancelled - FocusHouse",
    html,
  });
}
