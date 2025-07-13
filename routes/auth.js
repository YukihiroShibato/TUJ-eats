const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');

const router = express.Router();

// Set up Multer storage
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// REGISTER ROUTE
router.post('/register', upload.single('student_id_image'), async (req, res) => {
  try {
    const { tuid, email, password, first_name, last_name } = req.body;
    const studentIdImage = req.file ? req.file.filename : null;

    // Check for @tuj.temple.edu email
    if (!email.endsWith('@temple.edu')) {
      return res.status(400).send('Must use @temple.edu email');
    }

    // Validate required fields
    if (!tuid || !email || !password || !first_name || !last_name || !studentIdImage) {
      return res.status(400).send('Missing fields');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      tuid,
      email,
      password: hashedPassword,
      firstName: first_name,
      lastName: last_name,
      studentIdImage
    });

    await newUser.save();

    res.status(201).send('User registered successfully');
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).send('Email already registered');
    }
    res.status(500).send('Server error');
  }
});




// LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Find user by email or tuid
    const user = await User.findOne({
      $or: [{ email: identifier }, { tuid: identifier }]
    });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Invalid password');
    }

    // Success
    res.send({
      message: 'Login successful',
      user: {
        id: user._id,
        tuid: user.tuid,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /api/change-password
router.post('/change-password', async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).send('Missing required fields');
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // ✅ Use bcrypt to compare
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).send('Current password is incorrect');
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.send('Password updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


// POST /api/verify-password
router.post('/verify-password', async (req, res) => {
  try {
    const { userId, currentPassword } = req.body;

    if (!userId || !currentPassword) {
      return res.status(400).send('Missing required fields');
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).send('Current password is incorrect');
    }

    res.send('Password verified');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});



module.exports = router;
