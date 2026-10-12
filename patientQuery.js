
const { Patient } = require('./models');

// Add patients

async function createPatient(a, b, c) {
    try {
        const patient = await Patient.create({
            name: a,
            email: b,
            phone: c
        });
        console.log(patient.toJSON());
    } catch (error) {
        console.error(error);
    }
}

// createPatient("Aman", "aman@example.com", "9876543210");
// createPatient("Pinky", "pinky@example.com", "9876543211");


// Retrieve all patients

async function findPatients() {
    const patients = await Patient.findAll();
    console.log(patients);
}
//findPatients();


// Find a particular patient by email

async function findPatient() {
    const patient = await Patient.findOne({
        where: {
            email: 'rahul@example.com'
        }
    });
    console.log(patient);
}
//findPatient();


// Retrieve by Primary Key

async function findByPk() {
    const patient = await Patient.findByPk(1);
    console.log(patient);
}
//findByPk();


// Retrieve only selected attributes

async function findByAttribute() {
    const patients = await Patient.findAll({
        attributes: ['name', 'email']
    });
    console.log(patients);
}
// findByAttribute();


// Find patients using operators

const { Op } = require('sequelize');

async function findPatientByName() {
    const patients = await Patient.findAll({
        where: {
            name: {
                [Op.like]: '%Rahul%'
            }
        }
    });
    console.log(patients);
}
// findPatientByName();
