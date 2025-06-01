const db = require('../Db/DbConnection');


exports.getAllBanners = async (req, res) => {
    try {
      const [banners] = await db.query('SELECT * FROM banner_images ORDER BY id DESC');
      res.json(banners);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching banners' });
    }
  };


// Create Banner
exports.createBanner = async (req, res) => {
  const { image } = req.body;

  try {
    const [result] = await db.query('INSERT INTO banner_images (image) VALUES (?)', [image]);
    res.status(201).json({ message: 'Banner created successfully', id: result.insertId });} catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating banner' });
  }
};

// Delete Banner
exports.deleteBanner = async (req, res) => {
  const { id } = req.params;

  try {

    const [product] = await db.execute('SELECT * FROM banner_images WHERE id = ?', [id]);
console.log(product);
    if (product.length === 0) {
      return res.status(404).json({ message: 'Banner not exist' });
    }
    

    await db.query('DELETE FROM banner_images WHERE id = ?', [id]);
    res.json({ message: 'Banner deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting banner' });
  }
};
