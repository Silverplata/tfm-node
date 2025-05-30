const jwt = require('jsonwebtoken');

const checkToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No se proporcionó token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Añade userId y role al objeto req
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalido o token expirado' });
  }
};

const checkGuideRole = (req, res, next) => {
  if (req.user.role !== 'guide') {
    return res.status(403).json({ message: 'Solamente los guias estan autorizados' });
  }
  next();
};

module.exports = { checkToken, checkGuideRole };