const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Get all bookings for current user (as owner)
router.get('/', verifyToken, async (req, res) => {
  try {
    const bookings = await db.getBookingsByOwnerId(req.userId);
    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get booking by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const booking = await db.getBookingById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.owner_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const pets = await db.getPetsByBookingId(req.params.id);
    res.json({ ...booking, pets });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create booking
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      pet_ids,
      start_datetime,
      end_datetime,
      latitude,
      longitude,
      address_text,
      allow_previsit,
      previsit_start_date,
      previsit_end_date,
      care_description,
    } = req.body;

    if (!pet_ids || !Array.isArray(pet_ids) || pet_ids.length === 0) {
      return res.status(400).json({ error: 'At least one pet is required' });
    }

    if (!start_datetime || !end_datetime) {
      return res.status(400).json({ error: 'Start and end datetime are required' });
    }

    if (!address_text || !latitude || !longitude) {
      return res.status(400).json({ error: 'Address and location are required' });
    }

    // Verify all pets belong to user
    for (const petId of pet_ids) {
      const pet = await db.getPetById(petId);
      if (!pet || pet.user_id !== req.userId) {
        return res.status(400).json({ error: `Pet ${petId} not found or access denied` });
      }
    }

    const booking = {
      id: uuidv4(),
      owner_id: req.userId,
      sitter_id: null,
      start_datetime,
      end_datetime,
      previsit_start_date: allow_previsit ? previsit_start_date : null,
      previsit_end_date: allow_previsit ? previsit_end_date : null,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      allow_previsit: allow_previsit === true || allow_previsit === 'true',
      address_text,
      status: 'pending',
      care_description: care_description || '',
      created_at: new Date().toISOString(),
    };

    await db.createBooking(booking, pet_ids);
    res.status(201).json(booking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update booking
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const booking = await db.getBookingById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.owner_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedBooking = {
      ...booking,
      ...req.body,
    };

    await db.updateBooking(updatedBooking);
    res.json(updatedBooking);
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete booking
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const booking = await db.getBookingById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.owner_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await db.deleteBooking(req.params.id);
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

