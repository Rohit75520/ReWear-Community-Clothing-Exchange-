// app.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Import MongoDB connection
const path = require('path'); // For serving static files

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const itemRoutes = require('./routes/items');
const uploadRoutes = require('./routes/upload');
const swapRoutes = require('./routes/swaps'); // New import
const adminRoutes = require('./routes/admin'); // New import

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser middleware (to parse JSON in request body)
app.use(express.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/swaps', swapRoutes); // Mount swap routes
app.use('/api/admin', adminRoutes); // Mount admin routes

// Basic route for testing
app.get('/', (req, res) => {
    res.send('ReWear API (MongoDB) is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});