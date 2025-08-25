// controllers/adminController.js
const pool = require('../config/db');

// Assign role to user
exports.assignRole = async (req, res) => {
  const { userId, roleId } = req.body;

  try {
    // 1. Check if user exists
    const [userRows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (userRows.length === 0) return res.status(404).json({ message: 'User not found' });

    // 2. Check if role exists
    const [roleRows] = await pool.query('SELECT * FROM roles WHERE id = ?', [roleId]);
    if (roleRows.length === 0) return res.status(404).json({ message: 'Role not found' });

    // 3. Assign role (insert or ignore duplicate)
    await pool.query(
      'INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (?, ?)',
      [userId, roleId]
    );

    return res.status(200).json({ message: 'Role assigned successfully' });
  } catch (err) {
    console.error('[AssignRole Error]', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Activate user account
exports.activateUser = async (req, res) => {
  const { userId } = req.body;

  try {
    const [userRows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (userRows.length === 0) return res.status(404).json({ message: 'User not found' });

    await pool.query('UPDATE users SET is_active = 1 WHERE id = ?', [userId]);

    return res.status(200).json({ message: 'User activated successfully' });
  } catch (err) {
    console.error('[ActivateUser Error]', err);
    res.status(500).json({ message: 'Server error' });
  }
};
