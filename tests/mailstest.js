const nodemailer = require('nodemailer');

async function sendtestmail() {
  const testAccount = await nodemailer.createTestAccount(); // creates a fake account

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: '"Test App" <no-reply@test.com>',
    to: 'your_test_email@ethereal.email',
    subject: 'Hello from test app',
    html: '<h1>Test Email</h1>',
  });
  return {
    messageID: info.messageId,
    PreviewURL: nodemailer.getTestMessageUrl(info),
  }
  //console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
}

module.exports = sendtesttomail;
