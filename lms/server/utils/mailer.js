import nodemailer from 'nodemailer';

let transporter;
function getTransporter() {
  if (transporter) return transporter;
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.warn('Mailer: Missing SMTP env vars. Emails will not be sent.');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: String(SMTP_SECURE || '').toLowerCase() === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
  return transporter;
}

export const sendMail = async ({ to, subject, text, html, from }) => {
  const tx = getTransporter();
  if (!tx) {
    return { success: false, error: 'mailer-not-configured' };
  }

  const mailOptions = {
    from: from || process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html
  };

  try {
    const info = await tx.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Mailer sendMail error:', error);
    return { success: false, error: error?.message || 'send-error' };
  }
};

export default { sendMail };
