const db = require('../Db/DbConnection');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
const [products] = await db.execute(
  `SELECT p.*,
   CASE 
       WHEN toff.id IS NOT NULL THEN true
       ELSE false
   END AS isTopOffer
   FROM products p
   LEFT JOIN todaysoffer toff ON p.id = toff.product_id`);
   console.log(products);
    res.json(products);
  } catch (err) {
    res.status(500).json({err, message: 'Error fetching products' });
  }
};


exports.getAllProductssix = async (req, res) => {
  try {
    const [products] = await db.execute('SELECT * FROM products ORDER BY id DESC LIMIT 6');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const [products] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const product=products[0];
    if (product.OtherPlatforms) {
    product.OtherPlatforms = JSON.parse(product.OtherPlatforms);
    }
    res.json(product);
  } catch (err) {
     product.OtherPlatforms = {};
    res.status(500).json({ message: 'Error fetching product' });
    
  }
};


// Add product
exports.addProduct = async (req, res) => {
  const { name, description, price, discount, image_url, stock, category_id, size, packof ,OtherPlatforms,MRP } = req.body;

  try {
    await db.execute(
      `INSERT INTO products (name, description, price, discount, image_url, stock, category_id, size, packof ,OtherPlatforms ,MRP) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)`,
      [name, description, price, discount, image_url, stock, category_id, size, packof , OtherPlatforms ,MRP]
    );

    res.status(201).json({ message: 'Product added successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add product' });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, discount, image_url, stock, category_id, size, packof ,MRP,OtherPlatforms } = req.body;

  try {
    const [product] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);

    if (product.length === 0) {
      return res.status(404).json({ message: 'Product not exist' });
    }
    

    await db.execute(
      `UPDATE products SET name=?, description=?, price=?, discount=?, image_url=?, stock=?, category_id=?, size=?, packof=?,MRP=?,OtherPlatforms=? WHERE id=?`,
      [name, description, price, discount, image_url, stock, category_id, size, packof ,MRP,OtherPlatforms,id]
    );

    res.json({ message: 'Product updated successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Error updating product' });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {

    const [product] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);

    if (product.length === 0) {
      return res.status(404).json({ message: 'Product not exist' });
    }
    

    await db.execute('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};


exports.updateRating = async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;

  try {
    const [product] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);

    if (product.length === 0) {
      return res.status(404).json({ message: 'Product not exist' });
    }

   

    await db.execute('UPDATE products SET rating = ? WHERE id = ?', [rating, id]);
    res.json({ message: 'Rating updated successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Error updating rating' });
  }
}