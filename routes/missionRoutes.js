const express = require('express');
const router = express.Router();
const { getMissions, completeMission } = require('../controllers/missionController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, getMissions);
router.post('/complete/:id', authMiddleware, completeMission);

module.exports = router;
