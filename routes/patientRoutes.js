const express = require('express');
const {assignPatient, findDoctor} = require('../controllers/patientController');

const router = express.Router();

router.post('/assign', assignPatient);
router.get('/doctor/:doctorId',findDoctor);

module.exports = router;