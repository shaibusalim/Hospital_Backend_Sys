require('dotenv').config();
const express = require('express');
const {userRoutes, noteRoutes, patientRoutes} = require('./routes/Index');
const sequelize = require('./config/database');

const app = express();
app.use(express.json());


// Routes
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/notes', noteRoutes);

// Database synchronization
sequelize.sync({alter : true})
  .then(async() => {
    console.log('Database synchronized');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
  })
  .catch(err => {
    console.error('❌ Database synchronization failed:', err.message);
    process.exit(1); // Exit process if database fails to sync
});
