require('dotenv').config();
const request = require('supertest');
const app = require('../server');
const sequelize = require('../config/database');
const User = require('../models/User');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
    await User.destroy({ where: {} }); // Clear users before each test to prevent data conflicts
  });

describe('User Routes', () => {
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/api/users/signup')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'Patient',
      });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User created successfully');
    expect(response.body.user).toHaveProperty('id'); // Ensure user ID is returned
    expect(response.body.user.email).toBe('john@example.com');
  });

  it('should login a user', async () => {

    // Create the user before testing login
    await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: await require('bcrypt').hash('password123', 10),
        role: 'Patient',
      });


    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'john@example.com',
        password: 'password123',
      });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
    expect(response.body).toHaveProperty('token'); // Ensure a JWT token is returned
    expect(typeof response.body.token).toBe('string'); // Token should be a string
  });
});
