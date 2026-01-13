import 'dotenv/config';
import { sendMail } from '../utils/mailer.js';

async function main() {
  const to = process.argv[2] || process.env.TEST_EMAIL_TO;
  if (!to) {
    console.error('Please provide a recipient email as an argument or set TEST_EMAIL_TO in .env');
    process.exit(1);
  }
  const res = await sendMail({
    to,
    subject: 'Test email from LMS server',
    text: 'This is a test email to verify SMTP configuration.',
    html: '<p>This is a <strong>test email</strong> to verify SMTP configuration.</p>'
  });
  console.log('SendMail result:', res);
}

main().catch((e) => {
  console.error('Test email error:', e);
  process.exit(1);
});
