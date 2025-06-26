const express = require('express');
const router = express.Router();
const { getEvents, createEvent } = require('../controllers/eventController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, getEvents);        // rotta protetta
router.post('/', authMiddleware, createEvent);     // rotta protetta

module.exports = router;
