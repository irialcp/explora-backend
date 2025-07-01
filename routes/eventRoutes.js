const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

const {
    getEvents,
    createEvent,
    getNearbyEvents,
    countByCategory,
    closestEvents,         // <— assicurati ci sia
    comprehensiveStats     // <— e questo
} = require('../controllers/eventController');

// Rotte geospaziali e statistiche
router.get('/nearby',            authMiddleware, getNearbyEvents);
router.get('/stats/category',    authMiddleware, countByCategory);
router.get('/stats/closest',     authMiddleware, closestEvents);
router.get('/stats/all',         authMiddleware, comprehensiveStats);

// Rotte “classiche”
router.get('/',                  authMiddleware, getEvents);
router.post('/',                 authMiddleware, createEvent);

module.exports = router;
