
const express = require('express');
const router = express.Router();
const { Patient } = require('../models');

// Get all patients
router.get('/', async (req, res) => {
    try {
        const patients = await Patient.findAll();
        res.json(patients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a patient
router.post('/', async (req, res) => {
    try {
        const patient = await Patient.create({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone
        });

        res.status(201).json(patient);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get a patient by ID
router.get('/:id', async (req, res) => {
    try {
        const patient = await Patient.findByPk(req.params.id);

        if (!patient) {
            return res.status(404).json({
                error: 'Patient not found'
            });
        }

        res.json(patient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a patient
router.put('/:id', async (req, res) => {
    try {
        const patient = await Patient.findByPk(req.params.id);

        if (!patient) {
            return res.status(404).json({
                error: 'Patient not found'
            });
        }

        await patient.update({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone
        });

        res.json(patient);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a patient
router.delete('/:id', async (req, res) => {
    try {
        const patient = await Patient.findByPk(req.params.id);

        if (!patient) {
            return res.status(404).json({
                error: 'Patient not found'
            });
        }

        await patient.destroy();

        res.json({
            message: 'Patient deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;