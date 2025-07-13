const express = require('express');
const multer = require('multer');
const Restaurant = require('../models/Restaurant');
const path = require('path');

const router = express.Router();

// Setup Multer for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// POST /api/restaurants
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { name, branch, category } = req.body;

    if (!name || !branch || !category) {
      return res.status(400).send('Missing required fields');
    }

    const photoFilename = req.file ? req.file.filename : null;

    const newRestaurant = new Restaurant({
      name,
      branch,
      category,
      photoFilename
    });

    await newRestaurant.save();

    res.status(201).send('Restaurant added successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;

// GET /api/restaurants
router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find().sort({ createdAt: -1 });
    res.json(restaurants);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

