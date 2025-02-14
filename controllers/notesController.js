const { encrypt, decrypt } = require('../utils/encryption');
const Note = require('../models/Note');
const ActionableStep = require('../models/ActionableStep');
const { extractActionableSteps } = require('../utils/llmIntegration');

const ERROR_MESSAGES = {
  MISSING_FIELDS: 'Missing required fields: patientId, doctorId, or content',
  LLM_API_FAILED: 'Failed to extract actionable steps',
  NO_STEPS_FOUND: 'No actionable steps found for this note',
};

const getNotes = async (req, res) => {
  try {
    const notes = await Note.findAll();

    const decryptedNotes = notes.map(note => ({
      ...note.toJSON(),
      content: decrypt(note.content), // 🔓 Decrypt the content before sending
    }));

    res.status(200).json(decryptedNotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const submitDoctorNote = async (req, res) => {
  const { patientId, doctorId, content } = req.body;

  // Validate input
  if (!patientId || !doctorId || !content) {
    return res.status(400).json({ message: ERROR_MESSAGES.MISSING_FIELDS });
  }

  try {
    const encryptedContent = encrypt(content); // 🔒 Encrypt note content

    // Create the note
    const note = await Note.create({ patientId, doctorId, content: encryptedContent });

    // Extract actionable steps using LLM
    const actionableData = await extractActionableSteps(content);

    // Validate actionable data
    if (!actionableData) {
      return res.status(500).json({ message: ERROR_MESSAGES.LLM_API_FAILED });
    }

    // Cancel old actionable steps before adding new ones
    await ActionableStep.destroy({ where: { noteId: note.id } });

    // Create actionable steps
    const actionableStep = await ActionableStep.create({
      noteId: note.id,
      checklist: actionableData.checklist,
      plan: actionableData.plan,
    });

    res.status(201).json({ message: 'Note submitted successfully', note, actionableStep });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getActionableStep = async (req, res) => {
  const { noteId } = req.params;

  // Validate noteId
  if (!noteId) {
    return res.status(400).json({ message: 'Missing noteId' });
  }

  try {
    const steps = await ActionableStep.findOne({ where: { noteId } });

    if (!steps) {
      return res.status(404).json({ message: ERROR_MESSAGES.NO_STEPS_FOUND });
    }

    res.status(200).json(steps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getNotes,
  submitDoctorNote,
  getActionableStep,
};