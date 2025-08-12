const nodemailer = require('nodemailer');

async function main() {
  let testAccount = await nodemailer.createTestAccount(); // creates a fake account

  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  let info = await transporter.sendMail({
    from: '"Test App" <no-reply@test.com>',
    to: 'your_test_email@ethereal.email',
    subject: 'Hello from test app',
    html: '<h1>Test Email</h1>',
  });

  console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
}

main().catch(console.error);
