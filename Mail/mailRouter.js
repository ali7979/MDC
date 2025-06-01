const express = require('express');
const router = express.Router();
const sendContactUsEmail = require('./sendContactUsEmail');

router.post('/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    await sendContactUsEmail({ name, email, phone, message });
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send message.' });
  }
});

module.exports = router;