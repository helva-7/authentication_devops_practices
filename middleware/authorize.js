const jwt = require('jsonwebtoken');

module.exports = (requiredPermission) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader) return res.status(401).json({ message: 'No token provided' });

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded.permissions.includes(requiredPermission)) {
        return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
      }

      req.user = decoded; // Attach user to request
      next();
    } catch (err) {
      console.error('[Auth Middleware Error]', err);
      res.status(401).json({ message: 'Unauthorized' });
    }
  };
};
