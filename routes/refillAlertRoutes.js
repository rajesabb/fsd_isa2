
const express = require('express');
const router = express.Router();
const { RefillAlert, Prescription } = require('../models');

// Get all refill alerts with prescription details
router.get('/', async (req, res) => {
    try {
        const alerts = await RefillAlert.findAll({
            include: [{
                model: Prescription,
                as: 'prescription'
            }]
        });

        res.json(alerts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a refill alert
router.post('/', async (req, res) => {
    try {
        const alert = await RefillAlert.create({
            prescriptionId: req.body.prescriptionId,
            alertDate: req.body.alertDate,
            message: req.body.message,
            status: 'pending'
        });

        res.status(201).json(alert);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update refill alert status
router.patch('/:id/status', async (req, res) => {
    try {
        const alert = await RefillAlert.findByPk(req.params.id);

        if (!alert) {
            return res.status(404).json({
                error: 'Refill alert not found'
            });
        }

        alert.status = req.body.status;
        await alert.save();

        res.json(alert);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get alerts for a particular prescription
router.get('/prescription/:prescriptionId', async (req, res) => {
    try {
        const alerts = await RefillAlert.findAll({
            where: {
                prescriptionId: req.params.prescriptionId
            }
        });

        res.json(alerts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a refill alert
router.delete('/:id', async (req, res) => {
    try {
        const alert = await RefillAlert.findByPk(req.params.id);

        if (!alert) {
            return res.status(404).json({
                error: 'Refill alert not found'
            });
        }

        await alert.destroy();

        res.json({
            message: 'Refill alert deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;