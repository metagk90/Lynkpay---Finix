import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com",
  port: parseInt(process.env.BREVO_SMTP_PORT || "587", 10),
  secure: false, // TLS via STARTTLS
  auth: {
    user: process.env.BREVO_SMTP_USER || "",
    pass: process.env.BREVO_SMTP_PASSWORD || "",
  },
})

interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text?: string
  replyTo?: string
}

export async function sendEmail({ to, subject, html, text, replyTo }: SendEmailOptions): Promise<boolean> {
  const from = process.env.EMAIL_FROM || "LynkPay <noreply@lynkpay.co>"

  // Skip sending if SMTP credentials are not configured
  if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_PASSWORD) {
    console.warn("[email] SMTP credentials not configured, skipping email send to:", to)
    return false
  }

  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""), // Strip HTML for plain text fallback
      replyTo: replyTo || process.env.EMAIL_REPLY_TO || undefined,
      headers: {
        "X-Priority": "1",
        "X-Mailer": "LynkPay",
      },
    })
    return true
  } catch (error) {
    console.error("[email] Failed to send email:", error)
    return false
  }
}

export { transporter }
