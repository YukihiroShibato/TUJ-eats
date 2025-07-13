const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');
const Order = require('../models/Order');

const router = express.Router();

// GET /api/messages?orderId=...
router.get('/', async (req, res) => {
  try {
    const { orderId } = req.query;
    if (!orderId) {
      return res.status(400).send('Missing orderId');
    }

    const messages = await Message.find({ orderId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /api/messages
router.post('/', async (req, res) => {
  try {
    const { orderId, senderId, text } = req.body;

    if (!orderId || !senderId || !text) {
      return res.status(400).send('Missing required fields');
    }

    const user = await User.findById(senderId);
    if (!user) {
      return res.status(404).send('Sender not found');
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).send('Order not found');
    }

    const newMessage = new Message({
      orderId,
      senderId,
      senderName: `${user.firstName} ${user.lastName}`,
      text
    });

    await newMessage.save();
    res.status(201).send('Message sent');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
