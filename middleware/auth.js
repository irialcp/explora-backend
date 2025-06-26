const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token mancante o formato errato' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // mettiamo l’id utente nella request per usarlo dopo
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token non valido' });
  }
};

module.exports = authMiddleware;
