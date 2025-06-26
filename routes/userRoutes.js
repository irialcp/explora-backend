const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);

router.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: `Benvenuto utente con id: ${req.user.id}` });
});



module.exports = router;
