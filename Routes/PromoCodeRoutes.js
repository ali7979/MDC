const express = require('express');
const router = express.Router();
const { validateCode } = require('../Controllers/PromoCodeController');
const { verifyToken, isAdmin } = require('../Middleware/AuthMiddleware');
const { getAllPromoCodes,deletePromoCode,createPromoCode} = require('../Controllers/PromoCodeController');

// router.get('/', getAllBanners);
router.post('/validate', verifyToken, validateCode);
// router.delete('/:id', verifyToken, isAdmin, deleteBanner);
router.get('/',verifyToken,isAdmin,getAllPromoCodes);
router.delete('/delete/:id',verifyToken,isAdmin,deletePromoCode)
router.post('/add',verifyToken,isAdmin,createPromoCode)

module.exports = router;
