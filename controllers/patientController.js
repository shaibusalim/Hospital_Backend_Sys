const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');


// Assign Doctor to Patient   
const assignPatient = async (req, res) => {

  const { patientId, doctorId } = req.body;

  try {
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    if (patient.doctorId && patient.doctorId !== doctorId) {
        return res.status(400).json({ message: 'Patient is already assigned to another doctor' });
      }

    patient.doctorId = doctorId;
    await patient.save();


    res.status(200).json({ message: 'Doctor assigned to patient', patient });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get Patients for Doctor  
const findDoctor = async (req, res) => {

  const { doctorId } = req.params;

  try {
    const patients = await Patient.findAll({ where: { doctorId } });

    if (!patients.length) {
        return res.status(404).json({ message: 'No patients assigned to this doctor' });
      }
      
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
    assignPatient,
    findDoctor
};