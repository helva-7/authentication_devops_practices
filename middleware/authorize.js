const jwt = require('jsonwebtoken');

// middlewares/authorize.js
module.exports = (requiredPermissionOrRole) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader) return res.status(401).json({ message: 'No token provided' });

      const token = authHeader.split(' ')[1];
      const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);

      // Check roles
      if (decoded.roles && decoded.roles.includes(requiredPermissionOrRole)) {
        req.user = decoded;
        return next();
      }

      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    } catch (err) {
      console.error('[Auth Middleware Error]', err);
      res.status(401).json({ message: 'Unauthorized' });
    }
  };
};
