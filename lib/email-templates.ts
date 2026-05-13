/**
 * Transactional Email Templates for LynkPay
 * All templates use inline CSS for maximum email client compatibility
 */

const baseStyles = `
  body { margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
  .card { background: linear-gradient(145deg, #18181b 0%, #0f0f10 100%); border: 1px solid #27272a; border-radius: 16px; padding: 32px; }
  .logo { font-size: 24px; font-weight: 900; color: #10b981; letter-spacing: -0.5px; margin-bottom: 24px; }
  .heading { font-size: 20px; font-weight: 700; color: #fafafa; margin: 0 0 16px 0; }
  .text { font-size: 14px; color: #a1a1aa; line-height: 1.6; margin: 0 0 16px 0; }
  .button { display: inline-block; background: #10b981; color: #000 !important; font-weight: 700; font-size: 14px; text-decoration: none; padding: 14px 28px; border-radius: 10px; margin: 8px 0; }
  .button:hover { background: #059669; }
  .code { background: #27272a; border: 1px solid #3f3f46; border-radius: 8px; padding: 16px; font-family: monospace; font-size: 16px; color: #10b981; text-align: center; letter-spacing: 2px; margin: 16px 0; }
  .divider { border: none; border-top: 1px solid #27272a; margin: 24px 0; }
  .footer { font-size: 12px; color: #52525b; text-align: center; margin-top: 24px; }
  .footer a { color: #71717a; text-decoration: none; }
  .highlight { color: #10b981; font-weight: 600; }
  .warning { background: #422006; border: 1px solid #78350f; border-radius: 8px; padding: 12px 16px; margin: 16px 0; }
  .warning-text { color: #fbbf24; font-size: 13px; margin: 0; }
  .order-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
  .order-table th { text-align: left; color: #71717a; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; padding: 8px 0; border-bottom: 1px solid #27272a; }
  .order-table td { color: #fafafa; font-size: 14px; padding: 12px 0; border-bottom: 1px solid #27272a; }
  .order-total { font-size: 18px; font-weight: 700; color: #10b981; }
`

function wrapTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LynkPay</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">LynkPay</div>
      ${content}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} LynkPay. All rights reserved.</p>
      <p><a href="https://lynkpay.co">lynkpay.co</a></p>
    </div>
  </div>
</body>
</html>
`
}

/* ─────────────────────────────────────────────────────────────────────────────
   1. WELCOME EMAIL - Sent after successful signup
   ───────────────────────────────────────────────────────────────────────────── */
export function welcomeEmail(data: { firstName: string; username: string; loginUrl: string }): { subject: string; html: string } {
  const subject = `Welcome to LynkPay, ${data.firstName}!`
  const html = wrapTemplate(`
    <h1 class="heading">Welcome to LynkPay!</h1>
    <p class="text">Hi <span class="highlight">${data.firstName}</span>,</p>
    <p class="text">Your account has been created successfully. You can now start building your creator page and monetizing your content.</p>
    <p class="text">Your profile URL: <span class="highlight">lynkpay.co/${data.username}</span></p>
    <a href="${data.loginUrl}" class="button">Go to Dashboard</a>
    <hr class="divider">
    <p class="text" style="font-size: 13px;">Here are some things you can do:</p>
    <ul style="color: #a1a1aa; font-size: 13px; line-height: 1.8;">
      <li>Add links, products, and digital content to your page</li>
      <li>Customize your page appearance and branding</li>
      <li>Share your link and start earning</li>
    </ul>
  `)
  return { subject, html }
}

/* ─────────────────────────────────────────────────────────────────────────────
   2. PASSWORD RESET EMAIL - Sent when user requests password reset
   ───────────────────────────────────────────────────────────────────────────── */
export function passwordResetEmail(data: { firstName: string; resetUrl: string; expiresIn: string }): { subject: string; html: string } {
  const subject = "Reset Your LynkPay Password"
  const html = wrapTemplate(`
    <h1 class="heading">Reset Your Password</h1>
    <p class="text">Hi <span class="highlight">${data.firstName}</span>,</p>
    <p class="text">We received a request to reset your password. Click the button below to create a new password:</p>
    <a href="${data.resetUrl}" class="button">Reset Password</a>
    <p class="text" style="font-size: 13px; margin-top: 16px;">This link will expire in <strong>${data.expiresIn}</strong>.</p>
    <div class="warning">
      <p class="warning-text">If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.</p>
    </div>
    <hr class="divider">
    <p class="text" style="font-size: 12px;">For security, this request was received from your account. If you did not make this request, please contact support.</p>
  `)
  return { subject, html }
}

/* ─────────────────────────────────────────────────────────────────────────────
   3. PASSWORD CHANGED CONFIRMATION - Sent after password is successfully changed
   ───────────────────────────────────────────────────────────────────────────── */
export function passwordChangedEmail(data: { firstName: string; changedAt: string }): { subject: string; html: string } {
  const subject = "Your LynkPay Password Has Been Changed"
  const html = wrapTemplate(`
    <h1 class="heading">Password Changed Successfully</h1>
    <p class="text">Hi <span class="highlight">${data.firstName}</span>,</p>
    <p class="text">Your LynkPay password was successfully changed on <strong>${data.changedAt}</strong>.</p>
    <div class="warning">
      <p class="warning-text">If you did not make this change, please reset your password immediately and contact support.</p>
    </div>
    <a href="https://lynkpay.co/forgot-password" class="button" style="background: #ef4444;">Secure My Account</a>
    <hr class="divider">
    <p class="text" style="font-size: 12px;">This is an automated security notification. If you made this change, no further action is required.</p>
  `)
  return { subject, html }
}

/* ─────────────────────────────────────────────────────────────────────────────
   4. ORDER CONFIRMATION (BUYER) - Sent to buyer after successful purchase
   ───────────────────────────────────────────────────────────────────────────── */
export function orderConfirmationEmail(data: {
  customerName: string
  orderId: string
  productTitle: string
  productType: string
  amount: string
  currency: string
  sellerName: string
  sellerUsername: string
  purchaseDate: string
}): { subject: string; html: string } {
  const subject = `Order Confirmed: ${data.productTitle}`
  const html = wrapTemplate(`
    <h1 class="heading">Thanks for your purchase!</h1>
    <p class="text">Hi <span class="highlight">${data.customerName}</span>,</p>
    <p class="text">Your order has been confirmed. Here are the details:</p>
    <table class="order-table">
      <tr>
        <th>Product</th>
        <th style="text-align: right;">Amount</th>
      </tr>
      <tr>
        <td>
          <strong>${data.productTitle}</strong><br>
          <span style="color: #71717a; font-size: 12px;">${data.productType} &bull; by ${data.sellerName}</span>
        </td>
        <td style="text-align: right;" class="order-total">${data.currency}${data.amount}</td>
      </tr>
    </table>
    <div class="code">Order ID: ${data.orderId}</div>
    <p class="text" style="font-size: 13px;">Purchased on ${data.purchaseDate}</p>
    <a href="https://lynkpay.co/${data.sellerUsername}" class="button">View Seller's Page</a>
    <hr class="divider">
    <p class="text" style="font-size: 12px;">If you have any questions about your purchase, please contact the seller directly through their LynkPay page.</p>
  `)
  return { subject, html }
}

/* ─────────────────────────────────────────────────────────────────────────────
   5. NEW SALE NOTIFICATION (SELLER) - Sent to seller when they make a sale
   ───────────────────────────────────────────────────────────────────────────── */
export function newSaleNotificationEmail(data: {
  sellerName: string
  productTitle: string
  amount: string
  currency: string
  customerEmail: string
  orderId: string
  saleDate: string
  dashboardUrl: string
}): { subject: string; html: string } {
  const subject = `New Sale: ${data.currency}${data.amount} for ${data.productTitle}`
  const html = wrapTemplate(`
    <h1 class="heading">You made a sale!</h1>
    <p class="text">Hi <span class="highlight">${data.sellerName}</span>,</p>
    <p class="text">Great news! Someone just purchased your product.</p>
    <table class="order-table">
      <tr>
        <th>Product</th>
        <th style="text-align: right;">Earned</th>
      </tr>
      <tr>
        <td>
          <strong>${data.productTitle}</strong><br>
          <span style="color: #71717a; font-size: 12px;">Buyer: ${data.customerEmail}</span>
        </td>
        <td style="text-align: right;" class="order-total">${data.currency}${data.amount}</td>
      </tr>
    </table>
    <div class="code">Order ID: ${data.orderId}</div>
    <p class="text" style="font-size: 13px;">Sale completed on ${data.saleDate}</p>
    <a href="${data.dashboardUrl}" class="button">View in Dashboard</a>
    <hr class="divider">
    <p class="text" style="font-size: 12px;">Keep creating great content and watch your earnings grow!</p>
  `)
  return { subject, html }
}

/* ─────────────────────────────────────────────────────────────────────────────
   6. EMAIL VERIFICATION - Sent when user needs to verify their email
   ───────────────────────────────────────────────────────────────────────────── */
export function emailVerificationEmail(data: { firstName: string; verificationUrl: string; expiresIn: string }): { subject: string; html: string } {
  const subject = "Verify Your LynkPay Email"
  const html = wrapTemplate(`
    <h1 class="heading">Verify Your Email</h1>
    <p class="text">Hi <span class="highlight">${data.firstName}</span>,</p>
    <p class="text">Please verify your email address to complete your LynkPay account setup.</p>
    <a href="${data.verificationUrl}" class="button">Verify Email</a>
    <p class="text" style="font-size: 13px; margin-top: 16px;">This link will expire in <strong>${data.expiresIn}</strong>.</p>
    <hr class="divider">
    <p class="text" style="font-size: 12px;">If you didn't create a LynkPay account, you can safely ignore this email.</p>
  `)
  return { subject, html }
}

/* ─────────────────────────────────────────────────────────────────────────────
   7. OTP VERIFICATION - Sent during signup to verify email ownership
   ───────────────────────────────────────────────────────────────────────────── */
export function otpVerificationEmail(data: { firstName: string; otp: string; expiresIn: string }): { subject: string; html: string } {
  const subject = `${data.otp} is your LynkPay verification code`
  const html = wrapTemplate(`
    <h1 class="heading">Verify Your Email</h1>
    <p class="text">Hi <span class="highlight">${data.firstName}</span>,</p>
    <p class="text">Use the verification code below to complete your signup:</p>
    <div class="code" style="font-size: 32px; letter-spacing: 8px; font-weight: 700;">${data.otp}</div>
    <p class="text" style="font-size: 13px;">This code will expire in <strong>${data.expiresIn}</strong>.</p>
    <div class="warning">
      <p class="warning-text">Never share this code with anyone. LynkPay will never ask for your verification code.</p>
    </div>
    <hr class="divider">
    <p class="text" style="font-size: 12px;">If you didn't request this code, you can safely ignore this email.</p>
  `)
  return { subject, html }
}
