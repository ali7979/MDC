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
   LEFT JOIN todaysoffer toff ON p.id = toff.product_id
   ORDER BY p.id DESC`
);
   console.log(products);
    res.json(products);
  } catch (err) {
    res.status(500).json({err, message: 'Error fetching products' });
  }
};


exports.getAllProductssix = async (req, res) => {
  try {
    const [products] = await db.execute('SELECT p.*,nps.newdesc FROM newprod nps JOIN products p ON nps.product_id = p.id ORDER BY nps.position ASC');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};




exports.updateProductssix= async (req, res) => {
  const position = parseInt(req.params.position);
  const { product_id, newdesc } = req.body;

  if (!product_id || !newdesc || position < 1 || position > 6) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    // Check if a record at this position already exists
    const [existing] = await db.query('SELECT * FROM newprod WHERE position = ?', [position]);

    if (existing.length > 0) {
      // Update the existing entry
      await db.query(
        'UPDATE newprod SET product_id = ?, newdesc = ? WHERE position = ?',
        [product_id, newdesc, position]
      );
    } else {
      // Insert new if position not found
      await db.query(
        'INSERT INTO newprod (product_id, position, newdesc) VALUES (?, ?, ?)',
        [product_id, position, newdesc]
      );
    }

    res.status(200).json({ message: 'Featured product updated successfully' });
  } catch (error) {
    console.error('Error updating featured product:', error);
    res.status(500).json({ message: 'Server error' });
  }
}



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


// exports.updateRating = async (req, res) => {
//   const { id } = req.params;
//   const { rating } = req.body;

//   try {
//     const [product] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);

//     if (product.length === 0) {
//       return res.status(404).json({ message: 'Product not exist' });
//     }

   

//     await db.execute('UPDATE products SET rating = ? WHERE id = ?', [rating, id]);
//     res.json({ message: 'Rating updated successfully' });

//   } catch (err) {
//     res.status(500).json({ message: 'Error updating rating' });
//   }
// }


exports.updateRating = async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;

  try {
    const [productResult] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);

    if (productResult.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = productResult[0];
    const currentRating = product.rating || 0;
    const currentCount = product.rating_count || 0;

    const newCount = currentCount + 1;
    const newAvgRating = ((currentRating * currentCount) + rating) / newCount;

    const roundedAvg = Math.round(newAvgRating * 2) / 2;

    await db.execute(
      'UPDATE products SET rating = ?, rating_count = ? WHERE id = ?',
      [roundedAvg, newCount, id]
    );

    res.json({ message: 'Rating updated successfully', averageRating: roundedAvg });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating rating' });
  }
};


exports.updateDisplayOrder = async (req, res) => {
  const {displayOrderList} = req.body; // Expecting an array of { id, displayOrder }
console.log("Received display order list:", displayOrderList);
  if (!Array.isArray(displayOrderList) || displayOrderList.length === 0) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const updatePromises = displayOrderList.map(({ id, displayOrder }) =>
      connection.execute('UPDATE products SET displayOrder = ? WHERE id = ?', [displayOrder, id])
    );

    await Promise.all(updatePromises);
    await connection.commit();

    res.json({ message: 'Display order updated successfully' });

  } catch (error) {
    await connection.rollback();
    console.error('Error updating display order:', error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }


}
