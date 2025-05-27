const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../Db/DbConnection'); 
require('dotenv').config();

// Register User
exports.registerUser = async (req, res) => {
  const { name, email, password, phone, address=null} = req.body;

  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length > 0) {
      console.log(rows)
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      'INSERT INTO users (name, email, password , phone , address) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword , phone , address]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getUserProfile = async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, name, email, isAdmin, phone, address FROM users WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: "Profile fetched successfully",
      user: rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [user] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user[0].password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    
    const JWT_SECRET = process.env.JWT_SECRET; 
    const token = jwt.sign(
      { id: user[0].id, isAdmin: user[0].isAdmin,email:user[0].email,phone:user[0].phone },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        isAdmin: user[0].isAdmin
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
