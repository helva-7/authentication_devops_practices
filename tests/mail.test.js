jest.mock('nodemailer', () => ({
  createTestAccount: jest.fn().mockResolvedValue({
    user: 'testuser',
    pass: 'testpass'
  }),
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({
      messageId: 'fake-message-id'
    })
  }),
  getTestMessageUrl: jest.fn().mockReturnValue('http://mock.ethereal.email/test-preview')
}));

const sendTestEmail = require('../utils/mailer');

describe('Email sending', () => {
  it('should send an email and return a preview URL', async () => {
    const { messageId, previewUrl } = await sendTestEmail('mock@example.com');

    expect(messageId).toBe('fake-message-id');
    expect(previewUrl).toBe('http://mock.ethereal.email/test-preview');
  });
});
