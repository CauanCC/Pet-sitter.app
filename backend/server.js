const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const petRoutes = require('./routes/pets');
const bookingRoutes = require('./routes/bookings');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Pet Sitting API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

