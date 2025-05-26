const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../Controllers/AuthController");
const { verifyToken, isAdmin } = require("../Middleware/AuthMiddleware");
const db = require("../Db/DbConnection");
const bcrypt = require('bcryptjs');


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", verifyToken, getUserProfile);
router.get("/isloggedin", verifyToken, (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "User is logged in", user: req.user });
});
router.get("/isAdmin",verifyToken,isAdmin, (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Admin is logged in", user: req.user });
});

router.put("/profileupdate", verifyToken, async (req, res) => {
  const userId = req.user.id; // Set by verifyToken middleware
  const { name, email, phone, address } = req.body;
  console.log("Profile update request:", req.body);

  if (!name || !email) {
    return res
      .status(400)
      .json({ success: false, message: "Name/Email are required." });
  }

  const sql = `
    UPDATE users 
    SET name = ?, email = ?, phone = ?, address = ?
    WHERE id = ?
  `;
  try {
    await db.execute(sql, [name, email, phone, address, userId]);
    console.log("User updated successfully:");
    return res
      .status(200)
      .json({ success: true, message: "User profile updated successfully." });
  } catch (err) {
    console.error("Error updating user:", err);
    return res
      .status(500)
      .json({ success: false, message: "Database update failed." });
  }
});

router.put("/addressupdate", verifyToken, async (req, res) => {
  const userId = req.user.id; // Set by verifyToken middleware
  const { address } = req.body;
  console.log("Profile update request:", req.body);

  if (!address) {
    return res
      .status(400)
      .json({ success: false, message: "Address missing." });
  }

  const sql = `
    UPDATE users 
    SET  address = ?
    WHERE id = ?
  `;
  try {
    await db.execute(sql, [address, userId]);
    console.log("Address updated successfully:");
    return res
      .status(200)
      .json({ success: true, message: "Address updated successfully." });
  } catch (err) {
    console.error("Error updating user:", err);
    return res
      .status(500)
      .json({ success: false, message: "Database update failed." });
  }
});


router.put("/passwordupdate", verifyToken, async (req, res) => {
  const userId = req.user.id; // Set by verifyToken middleware
  const { password }  = req.body;
  console.log("Profile update request:", req.body);
  if (!password) {
    return res
      .status(400)
      .json({ success: false, message: "Password missing." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const sql = `
    UPDATE users 
    SET password = ?
    WHERE id = ?
  `;
  try {
    await db.execute(sql, [hashedPassword, userId]);
    console.log("Password updated successfully:");
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully." });
  }

  catch (err) {
    console.error("Error updating user:", err);
    return res
      .status(500)
      .json({ success: false, message: "Database update failed." });
  }
});

module.exports = router;
