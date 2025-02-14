require('dotenv').config();
const axios = require('axios');

// Function to extract actionable steps from the note content using OpenAI's API
async function extractActionableSteps(noteContent) {
  try {
   
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      { inputs: noteContent },
      { headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` } }
    );

    
    // Return the response data (actionable steps or information from the API)
    return response.data;
  } catch (error) {
    console.error("LLM API Error:", error.response?.data || error.message);
    throw new Error('Failed to extract actionable steps. Please try again.');
  }
}

module.exports = { extractActionableSteps };
