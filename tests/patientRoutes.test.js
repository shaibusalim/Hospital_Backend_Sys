const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/database');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

beforeAll(async () => {
  await sequelize.sync({ force: true });
  // Create a test doctor
  await Doctor.create({ userId: 1 });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
    await Patient.destroy({ where: {} }); // Clear patients before each test
    await Doctor.destroy({ where: {} });  // Clear doctors before each test
  });


describe('Patient Routes', () => {

    let doctor, patient;

    beforeEach(async () => {
      // Create a test doctor before each test
      doctor = await Doctor.create({ userId: 1 });
  
      // Create a test patient before each test
      patient = await Patient.create({ userId: 2 });
    });

  it('should assign a doctor to a patient', async () => {
    const response = await request(app)
      .post('/api/patients/assign')
      .send({
        patientId: patient.id,
        doctorId: 1,
      });
    
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Doctor assigned to patient');

     // Fetch patient from the database to verify assignment
     const updatedPatient = await Patient.findByPk(patient.id);
     expect(updatedPatient.doctorId).toBe(doctor.id);
  });

  it('should get patients for a doctor', async () => {

      // Assign the doctor to the patient
      patient.doctorId = doctor.id;
      await patient.save();

    const response = await request(app)
    .get(`/api/patients/doctor/${doctor.id}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].id).toBe(patient.id);
  });
});
