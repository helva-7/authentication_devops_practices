// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken');
const pool = require('../config/db');
const sendMail = require('../utils/mailer');

exports.signup = async (req, res) => {
  const { email, password, firstName, secondName, phoneNumber } = req.body;
  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);

    // one verification token (the SAME one we store and email)
    const verificationToken = generateToken({ email }); // e.g. 1d expiry inside your util

    // single INSERT, let is_active default to 0
    await pool.query(
      `INSERT INTO users
        (email, password, first_name, second_name, phone_number, verification_token, is_verified, is_active)
       VALUES (?, ?, ?, ?, ?, ?, 0, 0)`,
      [email, hashed, firstName, secondName, phoneNumber, verificationToken]
    );

    const clientURL = process.env.CLIENT_URL || `http://localhost:${process.env.PORT}`;
    const verificationURL = `${clientURL}/api/auth/verify/${verificationToken}`;

    await sendMail(
      email,
      'Verify your email',
      `Click to verify: ${verificationURL}`,
      `<p>Click the link below to verify your email:</p>
       <p><a href="${verificationURL}" target="_blank" rel="noopener">Verify my email</a></p>`
    );

    res.status(201).json({ message: 'Signup successful. Please verify your email.' });
  } catch (err) {
    console.error('[Signup Error]', err);
    res.status(500).json({ message: 'Signup failed' });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    // 1. Decode and verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    // 2. Find user by token
    const [userRows] = await pool.query(
      'SELECT * FROM users WHERE email = ? AND verification_token = ?',
      [email, token]
    );

    if (userRows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }

    const user = userRows[0];

    if (user.is_verified) {
      return res.status(200).json({ message: 'Account already verified.' });
    }

    // 3. Update user to verified
    await pool.query(
      'UPDATE users SET is_verified = 1, verification_token = NULL WHERE email = ?',
      [email]
    );

    return res.status(200).json({ message: 'Email successfully verified. You can now log in.' });

  } catch (err) {
    console.error('[Email Verification Error]', err);
    return res.status(400).json({ message: 'Invalid or expired token.' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(404).json({ message: 'User not found' });

    const user = rows[0];
    if (!user.is_verified) return res.status(400).json({ message: 'Email not verified' });

    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendMail(email, 'Reset Your Password', `Click to reset: ${resetLink}`);

    return res.status(200).json({ message: 'Reset email sent' });
  } catch (err) {
    console.error('[ForgotPassword Error]', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE email = ?', [hashed, email]);

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('[ResetPassword Error]', err);
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // 2. Check if email is verified
    if (!user.is_verified) {
      return res.status(403).json({ message: 'Please verify your email first' });
    }
    if (!user.is_active) {
    return res.status(403).json({ message: 'Account not activated by admin yet' });
}
    // 3. Compare passwords
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

     const [roles] = await pool.query(
      `SELECT r.name 
       FROM roles r
       JOIN user_roles ur ON ur.role_id = r.id
       WHERE ur.user_id = ?`,
      [user.id]
    );
  
    const [permissions] = await pool.query(
      `SELECT p.name 
       FROM permissions p
       JOIN role_permissions rp ON rp.permission_id = p.id
       JOIN user_roles ur ON ur.role_id = rp.role_id
       WHERE ur.user_id = ?`,
      [user.id]
    );

    // 4. Generate JWT token
    const token = generateToken({ 
      id: user.id, 
      email: user.email, 
      roles: roles.map(r => r.name),
      permissions: permissions.map(p => p.name)
    });

    // 5. Return token and optionally user data
    res.status(200).json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        roles: roles.map(r => r.name),
        permissions: permissions.map(p => p.name)
      }
    });
  } catch (err) {
    console.error('[Login Error]', err);
    res.status(500).json({ message: 'Login failed' });
  }
  
};
