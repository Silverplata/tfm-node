const jwt = require('jsonwebtoken');

const checkToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Añade userId y role al objeto req
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const checkGuideRole = (req, res, next) => {
  if (req.user.role !== 'guide') {
    return res.status(403).json({ message: 'Only guides are authorized' });
  }
  next();
};

module.exports = { checkToken, checkGuideRole };