# Hospital Management System API

## Overview
This API is designed to manage patients, doctors, and notes in a hospital management system. It includes user authentication, patient-doctor assignments, note submissions, and actionable steps extraction using a live LLM.

## API Endpoints

### User Routes
- **POST /api/users/signup**
  - Create a new user (Patient/Doctor).
  - Request Body:
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123",
      "role": "Patient"
    }
    ```

- **POST /api/users/login**
  - Authenticate a user and return a JWT token.
  - Request Body:
    ```json
    {
      "email": "john@example.com",
      "password": "password123"
    }
    ```

### Patient Routes
- **POST /api/patients/assign**
  - Assign a doctor to a patient.
  - Request Body:
    ```json
    {
      "patientId": 1,
      "doctorId": 1
    }
    ```

- **GET /api/patients/doctor/:doctorId**
  - Retrieve patients assigned to a specific doctor.

### Note Routes
- **POST /api/notes/submit**
  - Submit a doctor note and extract actionable steps.
  - Request Body:
    ```json
    {
      "patientId": 1,
      "doctorId": 1,
      "content": "This is a test note."
    }
    ```

- **GET /api/notes/:noteId/actionable-steps**
  - Retrieve actionable steps for a specific note.

## LLM Integration
The API integrates with a live LLM to extract actionable steps from doctor notes. The extraction logic is implemented in the `utils/llmIntegration.js` file.

## Scheduling Utility
The API includes a scheduling utility for managing reminders based on patient check-ins and note submissions.

## Testing
Unit tests are implemented for user routes, patient routes, and note routes using Jest and Supertest.

## Installation
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Set up the database and environment variables in a `.env` file.
4. Start the server with `npm start`.

## Documentation
This documentation provides an overview of the API and its usage. For further details, refer to the code comments and structure.
