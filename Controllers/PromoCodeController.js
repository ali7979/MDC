const db = require('../Db/DbConnection');

// Validate a promo code
// Validate a promo code
exports.validateCode = async (req, res) => {
    try {
        const id=req.user.id;

        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ message: 'Promo code is required.' });
        }

        // Find promo code in DB
        const [promoRows] = await db.query('SELECT * FROM coupons WHERE code = ?', [code]);
        if (promoRows.length === 0) {
            return res.status(400).json({ message: 'Promo code not found.' });
        }
        const promo = promoRows[0];

        // Check if promo code is expired or inactive
      

        // // Check usage limit per user if userId is provided
        // if (userId && promo.usage_limit_per_user) {
        //     const [usageRows] = await db.query(
        //         'SELECT COUNT(*) as usageCount FROM promo_code_usages WHERE promo_code_id = ? AND user_id = ?',
        //         [promo.id, userId]
        //     );
        //     if (usageRows[0].usageCount >= promo.usage_limit_per_user) {
        //         return res.status(400).json({ message: 'Promo code usage limit reached for this user.' });
        //     }
        // }

      
        res.json({ message: 'Promo code is valid.', discount: promo.discount_percent ,min_purchase:promo.min_purchase,description:promo.description,max_amount:promo.max_amount });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

// Create a new promo code
exports.createPromoCode = async (req, res) => {
    try {
        const { code, discount_percent,min_purchase,description,max_amount } = req.body;
        if (!code || discount_percent == null || !min_purchase) {
            return res.status(400).json({ message: 'All Details are required.' });
        }

        // Check if code already exists
        const [existingRows] = await db.query('SELECT id FROM coupons WHERE code = ?', [code]);
        if (existingRows.length > 0) {
            return res.status(400).json({ message: 'Promo code already exists.' });
        }

        const [result] = await db.query(
            'INSERT INTO coupons (code, discount_percent,min_purchase,description,max_amount) VALUES (?, ?, ?, ?,?)',
            [code, discount_percent,min_purchase,description,max_amount]
        );
        
        res.status(201).json({
            message: 'Added Successfully',
            id: result.insertId,
            code,
            discount_percent,
            min_purchase,
            max_amount,
            description
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

// Get all promo codes
exports.getAllPromoCodes = async (req, res) => {
    try {
        const [promoCodes] = await db.query('SELECT * FROM coupons');
        res.json(promoCodes);
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

// Delete a promo code
exports.deletePromoCode = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM coupons WHERE id = ?', [id]);
        res.json({ message: 'Promo code deleted.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};
