const express = require('express');
const router = express.Router();
const orderController = require('../Controllers/OrderController');
const { verifyToken, isAdmin } = require('../Middleware/AuthMiddleware');

// Get All Orders (Admin only)
// router.get('/', verifyToken, isAdmin, orderController.getAllOrders);
router.get('/', verifyToken, isAdmin,orderController.getAllOrders);

router.get('/myorder', verifyToken, orderController.getOrderById);

router.get('/uandp/:pid', verifyToken, orderController.getOrderByUserIdandProductID);


// Get Single Order by ID (Accessible to authenticated users)
router.get('/:id', verifyToken, orderController.getOrderById);

// Create Order (Accessible to authenticated users, no admin required)
router.post('/', verifyToken, orderController.createOrder);

// Update Order (Admin only)
router.put('/:id', verifyToken, isAdmin, orderController.updateOrder);

// Delete Order (Admin only)
router.delete('/:id', verifyToken, isAdmin, orderController.deleteOrder);

module.exports = router;
