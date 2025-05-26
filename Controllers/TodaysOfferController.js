const db = require('../Db/DbConnection');
exports.getAllTodaysOffers = async (req, res) => {
    try {
        const query = `
            SELECT t.*, p.*
            FROM todaysoffer t
            JOIN products p ON t.product_id = p.id
        `;
        const result = await db.execute(query);
        res.status(200).json(result[0]);
    } catch (err) {
        console.error('Error fetching today\'s offers:', err);
        return res.status(500).json({ error: 'Failed to fetch today\'s offers' });
    }
};

exports.createTodaysOffer = async (req, res) => {
    const { product_id} = req.body;
    if (!product_id ) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const query = `
            INSERT INTO todaysoffer (product_id)
            VALUES (?)
        `;
        await db.execute(query, [product_id]);
        res.status(201).json({ message: 'Today\'s offer created successfully' });
    } catch (err) {
        console.error('Error creating today\'s offer:', err);
        return res.status(500).json({ error: 'Failed to create today\'s offer' });
    }
};

exports.deleteTodaysOffer = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'Offer ID is required' });
    }

    try {
        const query = `
            DELETE FROM todaysoffer
            WHERE product_id = ?
        `;
        await db.execute(query, [id]);
        res.status(200).json({ message: 'Today\'s offer deleted successfully' });
    } catch (err) {
        console.error('Error deleting today\'s offer:', err);
        return res.status(500).json({ error: 'Failed to delete today\'s offer' });
    }
}


