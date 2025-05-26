const express = require('express');
const router = express.Router();
const TodaysOfferController = require('../Controllers/TodaysOfferController');
const { verifyToken, isAdmin } = require('../Middleware/AuthMiddleware');

router.get('/', TodaysOfferController.getAllTodaysOffers);
 router.delete('/:id', verifyToken, isAdmin, TodaysOfferController.deleteTodaysOffer);
router.post('/', verifyToken, isAdmin, TodaysOfferController.createTodaysOffer);



module.exports = router;
