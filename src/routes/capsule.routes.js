const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const capsuleService = require('../services/capsule.service');

// Validation middleware
const validateCapsule = [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('message').notEmpty().withMessage('Message is required'),
    body('priority').isInt({ min: 1, max: 5 }).withMessage('Priority must be between 1 and 5'),
    body('targetDeliveryDate').isISO8601().withMessage('Invalid delivery date format')
];

// Create a new capsule
router.post('/', validateCapsule, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const capsule = await capsuleService.createCapsule(req.body);
        res.status(201).json(capsule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all capsules for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const capsules = await capsuleService.getCapsulesByUser(req.params.userId);
        res.json(capsules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a specific capsule by ID
router.get('/:id', async (req, res) => {
    try {
        const capsule = await capsuleService.getCapsuleById(req.params.id);
        if (!capsule) {
            return res.status(404).json({ message: 'Capsule not found' });
        }
        res.json(capsule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 