const express = require('express');
const router = express.Router();
const productController = require('../Controllers/ProductsController');
const { verifyToken, isAdmin } = require('../Middleware/AuthMiddleware');

// PUBLIC
router.get('/', productController.getAllProducts);
router.get('/six', productController.getAllProductssix);

router.put('/products/six/:position', productController.updateProductssix)


router.get('/getproductbyid/:id', productController.getProductById);

// ADMIN ONLY
router.post('/', verifyToken, isAdmin, productController.addProduct);
router.put('/update/:id', verifyToken, isAdmin, productController.updateProduct);
router.put('/updaterating/:id', verifyToken, productController.updateRating);

router.delete('/delete/:id', verifyToken, isAdmin, productController.deleteProduct);

module.exports = router;
