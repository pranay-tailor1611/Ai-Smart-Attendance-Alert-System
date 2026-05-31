import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
}

export async function sendAttendanceAlert({ to, studentName, percent, level, message }) {
  const transport = getTransporter();
  if (!transport) {
    console.log('[Email skipped] SMTP not configured. Would send to:', to);
    return { sent: false, reason: 'smtp_not_configured' };
  }
  const levelLabels = { green: 'Good', yellow: 'Warning', red: 'Critical' };
  await transport.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject: `[${levelLabels[level] || 'Alert'}] Attendance Alert - ${studentName} (${percent}%)`,
    html: `
      <h2>Smart Attendance Alert</h2>
      <p>Hello <strong>${studentName}</strong>,</p>
      <p>Your current attendance is <strong>${percent}%</strong> (Status: ${levelLabels[level]}).</p>
      <p>${message}</p>
      <p>Please log in to the dashboard for AI recommendations.</p>
    `,
  });
  return { sent: true };
}

export async function sendPasswordResetEmail({ to, name, resetUrl }) {
  const transport = getTransporter();
  if (!transport) {
    console.log('[Email skipped] Password reset for:', to, '| Link:', resetUrl);
    return { sent: false, reason: 'smtp_not_configured' };
  }
  await transport.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject: 'Reset your Smart Attendance AI password',
    html: `
      <h2>Password reset</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>You requested a password reset. Click the link below (valid for 1 hour):</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>If you did not request this, ignore this email.</p>
    `,
  });
  return { sent: true };
}
