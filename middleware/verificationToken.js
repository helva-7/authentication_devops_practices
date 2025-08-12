const jwt = require('jsonwebtoken');
const pool = require('../config/db');

module.exports = async function (req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [decoded.email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid token. User not found.' });
    }

    const user = rows[0];

    if (!user.is_verified) {
      return res.status(403).json({ message: 'Please verify your email before accessing this resource.' });
    }

    // Attach user to the request for future use
    req.user = user;
    next();
  } catch (err) {
    console.error('[Token Verification Error]', err);
    return res.status(400).json({ message: 'Invalid token.' });
  }
};

