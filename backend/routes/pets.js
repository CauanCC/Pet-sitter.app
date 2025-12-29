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

// Get all pets for current user
router.get('/', verifyToken, async (req, res) => {
  try {
    const pets = await db.getPetsByUserId(req.userId);
    res.json(pets);
  } catch (error) {
    console.error('Get pets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get pet by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const pet = await db.getPetById(req.params.id);

    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    if (pet.user_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(pet);
  } catch (error) {
    console.error('Get pet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create pet
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, breed, age, temperament } = req.body;

    if (!name || !breed || age === undefined) {
      return res.status(400).json({ error: 'Name, breed and age are required' });
    }

    const pet = {
      id: uuidv4(),
      user_id: req.userId,
      name,
      breed,
      age: parseInt(age),
      temperament: temperament || '',
      created_at: new Date().toISOString(),
    };

    await db.createPet(pet);
    res.status(201).json(pet);
  } catch (error) {
    console.error('Create pet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update pet
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const pet = await db.getPetById(req.params.id);

    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    if (pet.user_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { name, breed, age, temperament } = req.body;
    const updatedPet = {
      ...pet,
      name: name || pet.name,
      breed: breed || pet.breed,
      age: age !== undefined ? parseInt(age) : pet.age,
      temperament: temperament !== undefined ? temperament : pet.temperament,
    };

    await db.updatePet(updatedPet);
    res.json(updatedPet);
  } catch (error) {
    console.error('Update pet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete pet
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const pet = await db.getPetById(req.params.id);

    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    if (pet.user_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await db.deletePet(req.params.id);
    res.json({ message: 'Pet deleted successfully' });
  } catch (error) {
    console.error('Delete pet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

