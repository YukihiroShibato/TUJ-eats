const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const mongoose = require('mongoose');
const app = express();
const ordersRoutes = require('./routes/orders');
const messagesRoutes = require('./routes/messages');
const restaurantsRoutes = require('./routes/restaurants');
const commentsRoutes = require('./routes/comments');




app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', authRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/restaurants', restaurantsRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/comments', commentsRoutes);







mongoose.connect('mongodb+srv://yukihirofshibato21:12345678!@cluster0.dklpyuq.mongodb.net/tujeats?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));



// Serve static files in public
app.use(express.static(path.join(__dirname, 'public')));

// Use auth routes
app.use('/api', authRoutes);

// Example root test route
app.get('/', (req, res) => {
  res.send('✅ TUJ Eats Backend is running!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Server listening on port ${PORT}`));
