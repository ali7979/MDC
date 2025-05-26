const db = require('../Db/DbConnection');

// Create Category
exports.createCategory = async (req, res) => {
  const { name, image } = req.body;
  try {
    await db.execute('INSERT INTO categories (name, image) VALUES (?, ?)', [name, image]);
    res.status(201).json({ message: 'Category created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating category' });
  }
};

// Get All Categories
exports.getAllCategories = async (req, res) => {
  try {
    const [categories] = await db.execute('SELECT * FROM categories');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

// Get Single Category
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const [category] = await db.execute('SELECT * FROM categories WHERE id = ?', [id]);
    if (category.length === 0) return res.status(404).json({ message: 'Category not found' });
    res.json(category[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching category' });
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, image } = req.body;
  try {
    const [existing] = await db.execute('SELECT * FROM categories WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ message: 'Category not found' });

    await db.execute('UPDATE categories SET name = ?, image = ? WHERE id = ?', [name, image, id]);
    res.json({ message: 'Category updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating category' });
  }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting category' });
  }
};
