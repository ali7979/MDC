const express = require('express');
const router = express.Router();
const { createBanner, deleteBanner ,getAllBanners } = require('../Controllers/BannerController');
const { verifyToken, isAdmin } = require('../Middleware/AuthMiddleware');

router.get('/', getAllBanners);
router.post('/', verifyToken, isAdmin, createBanner);
router.delete('/:id', verifyToken, isAdmin, deleteBanner);

module.exports = router;
