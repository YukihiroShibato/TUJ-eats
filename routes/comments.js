const express = require('express');
const Comment = require('../models/Comment');
const User = require('../models/User');

const router = express.Router();

// GET /api/comments?restaurantId=...
router.get('/', async (req, res) => {
  try {
    const { restaurantId } = req.query;
    if (!restaurantId) {
      return res.status(400).send('Missing restaurantId');
    }

    const comments = await Comment.find({ restaurantId }).sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /api/comments
router.post('/', async (req, res) => {
  try {
    const { restaurantId, userId, text } = req.body;
    if (!restaurantId || !userId || !text) {
      return res.status(400).send('Missing required fields');
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const newComment = new Comment({
      restaurantId,
      userId,
      userName: `${user.firstName} ${user.lastName}`,
      text
    });

    await newComment.save();
    res.status(201).send('Comment added');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
