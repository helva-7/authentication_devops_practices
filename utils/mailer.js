const nodemailer = require('nodemailer');

let testAccount;
let transporter;

const setupEthereal = async () => {
  testAccount = await nodemailer.createTestAccount();

  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  console.log('📬 Ethereal test account created');
  console.log('Login at: https://ethereal.email');
  console.log(`User: ${testAccount.user}`);
  console.log(`Pass: ${testAccount.pass}`);
};

// Send email using transporter
const sendMail = async (to, subject, text, html) => {
  if (!transporter) await setupEthereal();

  const info = await transporter.sendMail({
    from: '"VerifyBot" <no-reply@example.com>',
    to,
    subject,
    text,
    html
  });

  console.log('✅ Message sent: %s', info.messageId);
  console.log('📨 Preview URL: %s', nodemailer.getTestMessageUrl(info));
};

module.exports = sendMail;
