
const express = require('express');
const { sequelize } = require('./models');

const app = express();

// Read JSON data
app.use(express.json());

// Import routes
const patientRoutes = require('./routes/patientRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const refillAlertRoutes = require('./routes/refillAlertRoutes');

// Connect routes
app.use('/api/patients', patientRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/refill-alerts', refillAlertRoutes);

// Home route
app.get('/', (req, res) => {
    res.json({
        message: 'Pharmacy Medicine Refill Reminder API is running'
    });
});

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(error => {
        console.error('Unable to connect to the database:', error.message);
        process.exitCode = 1;
    });