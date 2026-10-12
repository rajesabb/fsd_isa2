
const express = require('express');
const router = express.Router();
const { Prescription, Patient, RefillAlert, sequelize } = require('../models');
const { Op } = require('sequelize');

async function createRefillReminder(prescription, transaction) {
    const alertDate = new Date(prescription.refillDate);
    alertDate.setUTCDate(alertDate.getUTCDate() - 7);

    await RefillAlert.create({
        prescriptionId: prescription.id,
        alertDate,
        message: `${prescription.medicineName} refill is due on ${new Date(prescription.refillDate).toISOString().slice(0, 10)}.`,
        status: 'pending'
    }, { transaction });
}

// Get all prescriptions with patient details
router.get('/', async (req, res) => {
    try {
        const prescriptions = await Prescription.findAll({
            include: [{
                model: Patient,
                as: 'patient'
            }]
        });

        res.json(prescriptions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a prescription
router.post('/', async (req, res) => {
    try {
        const prescription = await sequelize.transaction(async transaction => {
            const createdPrescription = await Prescription.create({
                patientId: req.body.patientId,
                medicineName: req.body.medicineName,
                dosage: req.body.dosage,
                frequency: req.body.frequency,
                refillDate: req.body.refillDate,
                status: 'active'
            }, { transaction });

            await createRefillReminder(createdPrescription, transaction);
            return createdPrescription;
        });

        res.status(201).json(prescription);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update prescription details and schedule a reminder for a changed refill date
router.put('/:id', async (req, res) => {
    try {
        const prescription = await Prescription.findByPk(req.params.id);

        if (!prescription) {
            return res.status(404).json({ error: 'Prescription not found' });
        }

        await sequelize.transaction(async transaction => {
            const previousRefillDate = new Date(prescription.refillDate).getTime();

            await prescription.update({
                patientId: req.body.patientId,
                medicineName: req.body.medicineName,
                dosage: req.body.dosage,
                frequency: req.body.frequency,
                refillDate: req.body.refillDate
            }, { transaction });

            if (new Date(prescription.refillDate).getTime() !== previousRefillDate) {
                await createRefillReminder(prescription, transaction);
            }
        });

        res.json(prescription);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update prescription status
router.patch('/:id/status', async (req, res) => {
    try {
        const prescription = await Prescription.findByPk(req.params.id);

        if (!prescription) {
            return res.status(404).json({
                error: 'Prescription not found'
            });
        }

        prescription.status = req.body.status;
        await prescription.save();

        res.json(prescription);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get prescriptions for a particular patient
router.get('/patient/:patientId', async (req, res) => {
    try {
        const prescriptions = await Prescription.findAll({
            where: {
                patientId: req.params.patientId
            }
        });

        res.json(prescriptions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get prescriptions due for refill
router.get('/due-refills', async (req, res) => {
    try {
        const prescriptions = await Prescription.findAll({
            where: {
                status: 'active',
                refillDate: {
                    [Op.lte]: new Date()
                }
            },
            include: [{
                model: Patient,
                as: 'patient'
            }]
        });

        res.json(prescriptions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get one prescription with its patient and refill alerts
router.get('/:id', async (req, res) => {
    try {
        const prescription = await Prescription.findByPk(req.params.id, {
            include: [
                { model: Patient, as: 'patient' },
                { model: RefillAlert, as: 'refillAlerts' }
            ]
        });

        if (!prescription) {
            return res.status(404).json({ error: 'Prescription not found' });
        }

        res.json(prescription);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a prescription
router.delete('/:id', async (req, res) => {
    try {
        const prescription = await Prescription.findByPk(req.params.id);

        if (!prescription) {
            return res.status(404).json({
                error: 'Prescription not found'
            });
        }

        await prescription.destroy();

        res.json({
            message: 'Prescription deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;