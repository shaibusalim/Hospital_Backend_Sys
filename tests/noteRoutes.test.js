const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/database');
const Note = require('../models/Note');
const ActionableStep = require('../models/ActionableStep');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
    await ActionableStep.destroy({ where: {} }); // Clear actionable steps
    await Note.destroy({ where: {} }); // Clear notes
    await Patient.destroy({ where: {} }); // Clear patients
    await Doctor.destroy({ where: {} }); // Clear doctors
  });

describe('Note Routes', () => {

    let patient, doctor, note;

    beforeEach(async () => {
      // Create a test doctor and patient before each test
      doctor = await Doctor.create({ userId: 1 });
      patient = await Patient.create({ userId: 2 });
    });

  it('should submit a doctor note', async () => {
    const response = await request(app)
      .post('/api/notes/submit')
      .send({
        patientId: 1,
        doctorId: 1,
        content: 'This is a test note.',
      });
    
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Note submitted successfully');

     // Verify the note was actually created in the database
     const createdNote = await Note.findOne({ where: { content: 'This is a test note.' } });
     expect(createdNote).not.toBeNull();
     expect(createdNote.patientId).toBe(patient.id);
     expect(createdNote.doctorId).toBe(doctor.id);
    
  });

  it('should get actionable steps for a note', async () => {
    const note = await Note.create({ patientId: 1, doctorId: 1, content: 'This is a test note.' });
    await ActionableStep.create({ noteId: note.id, step: 'Follow up in one week' });

    const response = await request(app)
      .get(`/api/notes/${note.id}/actionable-steps`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0].step).toBe('Follow up in one week');
  });
});
