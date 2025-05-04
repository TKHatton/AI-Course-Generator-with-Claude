// backend/server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Get API key from environment variables
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

app.post('/api/generate-course', async (req, res) => {
  const { topic, audience, sessionLength, deliveryFormat } = req.body;
  
  try {
    const prompt = `Create a comprehensive, professional course curriculum on "${topic}" with the following specifications:
    - Target Audience: ${audience}
    - Session Length: ${sessionLength} minutes
    - Delivery Format: ${deliveryFormat}
    
    Please structure the course with:
    1. A compelling course title
    2. Learning objectives
    3. 3-5 detailed modules with content and activities
    4. Assessment methods
    5. Required materials/resources
    
    Format the response as a structured JSON object with clear sections.`;

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error generating course:', error);
    res.status(500).json({ error: 'Failed to generate course' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});