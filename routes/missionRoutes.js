const express = require('express');
const router = express.Router();
const { getMissions, completeMission, countTodayMissions } = require('../controllers/missionController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, getMissions);
router.post('/complete/:id', authMiddleware, completeMission);

router.get('/today/count', authMiddleware, countTodayMissions);


module.exports = router;
