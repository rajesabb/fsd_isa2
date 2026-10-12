
const { Prescription } = require('./models');

async function addPrescription() {
    try {
        const prescription = await Prescription.create({
            patientId: 1,
            medicineName: 'Paracetamol',
            dosage: '500 mg',
            frequency: 'Twice daily',
            refillDate: '2026-10-01',
            status: 'active'
        });

        console.log('Prescription added successfully!');
        console.log(prescription.toJSON());
    } catch (error) {
        console.log('Error:', error.message);
    } finally {
        await require('./models').sequelize.close();
    }
}

addPrescription();