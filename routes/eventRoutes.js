const express = require('express');
const router = express.Router();
const { getEvents, createEvent, getNearbyEvents } = require('../controllers/eventController');
const authMiddleware = require('../middleware/auth');

router.get('/nearby', authMiddleware, getNearbyEvents); // rotta per eventi vicini

router.get('/', authMiddleware, getEvents);        // rotta protetta
router.post('/', authMiddleware, createEvent);     // rotta protetta

module.exports = router;
