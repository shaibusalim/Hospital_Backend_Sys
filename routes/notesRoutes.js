const express = require('express');
const {getNotes, submitDoctorNote, getActionableStep} = require('../controllers/notesController');

const router = express.Router();

router.get('/', getNotes);
router.post('/submit', submitDoctorNote);
router.get('/:noteId/actionable-steps', getActionableStep);

module.exports = router;