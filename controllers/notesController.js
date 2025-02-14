const { encrypt, decrypt } = require('../utils/encryption');
const Note = require('../models/Note');
const ActionableStep = require('../models/ActionableStep');
const { extractActionableSteps } = require('../utils/llmIntegration');



const getNotes = async (req, res) => {
  try {
      const notes = await Note.findAll();

      const decryptedNotes = notes.map(note => ({
          ...note.toJSON(),
          content: decrypt(note.content) // 🔓 Decrypt the content before sending
      }));

      res.status(200).json(decryptedNotes);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


// Submit Doctor Note 
const submitDoctorNote = async(req, res) => {

  const { patientId, doctorId, content } = req.body;

  try {

    const encryptedContent = encrypt(content); // 🔒 Encrypt note content

    const note = await Note.create({ patientId, doctorId, content: encryptedContent });
    
    // Extract actionable steps using LLM
    const actionableData = await extractActionableSteps(content);

    if (!actionableData || !actionableData.checklist || !actionableData.plan) {
        return res.status(500).json({ message: 'Failed to extract actionable steps' });
      }

       // Cancel old actionable steps before adding new ones
    await ActionableStep.destroy({ where: { noteId: note.id } });

    const actionableStep = await ActionableStep.create({ 
        noteId: note.id, 
        checklist: actionableData.checklist, 
        plan: actionableData.plan 
    });

    res.status(201).json({ message: 'Note submitted successfully', note, actionableStep });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get Actionable Steps for a Note
const getActionableStep = async(req, res) => {

  const { noteId } = req.params;

  try {
    const steps = await ActionableStep.findOne({ where: { noteId } });

    if (!steps || steps.length === 0) {
        return res.status(404).json({ message: 'No actionable steps found for this note' });
      }

    res.status(200).json(steps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
    getNotes,
    submitDoctorNote,
    getActionableStep
};
