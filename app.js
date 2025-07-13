const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const ordersRoutes = require('./routes/orders');
const messagesRoutes = require('./routes/messages');
const restaurantsRoutes = require('./routes/restaurants');
const commentsRoutes = require('./routes/comments');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve static files in /public
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

// ✅ API routes
app.use('/api', authRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/restaurants', restaurantsRoutes);
app.use('/api/comments', commentsRoutes);

// ✅ MongoDB connection
mongoose.connect('mongodb+srv://yukihirofshibato21:12345678!@cluster0.dklpyuq.mongodb.net/tujeats?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Default root route
app.get('/', (req, res) => {
  res.send('✅ TUJ Eats Backend is running!');
});

// ✅ Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Server listening on port ${PORT}`));
