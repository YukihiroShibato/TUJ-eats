const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');

const router = express.Router();

// POST /api/orders
router.post('/', async (req, res) => {
  try {
    const { customerId, restaurant, orderDetails, deliveryLocation, deliveryTime, reward } = req.body;

    // Validate
    if (!customerId || !restaurant || !orderDetails || !deliveryLocation || !deliveryTime || !reward) {
      return res.status(400).send('Missing required fields');
    }

    // Get customer name for easy viewing
    const user = await User.findById(customerId);
    if (!user) {
      return res.status(404).send('Customer not found');
    }

    const newOrder = new Order({
      customerId,
      customerName: `${user.firstName} ${user.lastName}`,
      restaurant,
      orderDetails,
      deliveryLocation,
      deliveryTime,
      reward
    });

    await newOrder.save();
    res.status(201).send('Order posted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;

// GET /api/orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({ status: 'open' }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// PUT /api/orders/:id/accept
router.put('/:id/accept', async (req, res) => {
  try {
    const { deliveryPersonId } = req.body;

    if (!deliveryPersonId) {
      return res.status(400).send('Missing deliveryPersonId');
    }

    // Get delivery person name
    const user = await User.findById(deliveryPersonId);
    if (!user) {
      return res.status(404).send('Delivery person not found');
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).send('Order not found');
    }

    if (order.status !== 'open') {
      return res.status(400).send('Order is not available to accept');
    }

    order.status = 'accepted';
    order.deliveryPersonId = deliveryPersonId;
    order.deliveryPersonName = `${user.firstName} ${user.lastName}`;
    await order.save();

    res.send('Order accepted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET /api/activity
router.get('/activity', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).send('Missing userId');
    }

    const myRequests = await Order.find({ customerId: userId }).sort({ createdAt: -1 });
    const myDeliveries = await Order.find({ deliveryPersonId: userId }).sort({ createdAt: -1 });

    res.json({ myRequests, myDeliveries });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).send('Order not found');
    }
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
