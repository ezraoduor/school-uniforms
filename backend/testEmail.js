const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.NOTIFY_EMAIL,
    subject: 'Test Email',
    text: 'This is a test email from Nodemailer.'
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent!');
  } catch (err) {
    console.error('❌ Error sending test email:', err);
  }
}

testEmail();
