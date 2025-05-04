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

// Function to generate content using Claude API
async function generateContent(prompt) {
  try {
    const response = await axios.post('https://api.anthropic.com/v1/complete', {
      prompt: `Human: ${prompt}\n\nAssistant:`,
      model: 'claude-2',
      max_tokens_to_sample: 2000,
      stop_sequences: ['\n\nHuman:']
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': CLAUDE_API_KEY,
        'anthropic-version': '2023-01-01'
      }
    });

    return response.data.completion;
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw error;
  }
}

// API endpoint for generating complete educational program
app.post('/api/generate-program', async (req, res) => {
  try {
    const { programTitle, audience, emotionalTone, startingPoint, desiredTransformation, courses } = req.body;
    
    const programOverviewPrompt = `Generate a comprehensive Program Overview Document including:
      1. Executive Summary (300-500 words)
      2. Program Vision and Mission
      3. Target Audience Analysis
      4. Program Goals and Objectives
      5. Key Benefits and Transformations
      6. Program Structure and Organization
      
      Program Title: ${programTitle}
      Target Audience: ${audience}
      Starting Point: ${startingPoint}
      Desired Transformation: ${desiredTransformation}
      
      Format in Markdown with clear headers and professional language.`;

    const programOverview = await generateContent(programOverviewPrompt);

    const coursesPromises = courses.map(async (course) => {
      const coursePrompt = `Create a comprehensive course document (1000-1500 words) for:
        Course Title: ${course.title}
        Description: ${course.description}
        Key Modules: ${course.modules}
        
        Structure:
        1. Course Overview
        2. Learning Objectives
        3. Target Audience & Prerequisites
        4. Module Breakdown (detailed content for each module)
        5. Teaching Methods & Tools
        6. Practical Applications & Exercises
        7. Assessment Methods
        8. Resources & Materials Needed
        
        Format in Markdown with clear structure and detailed content.`;

      return generateContent(coursePrompt);
    });

    const courseDocuments = await Promise.all(coursesPromises);

    const assessmentPrompt = `Create a comprehensive Assessment Packet including:
      1. Multiple Choice Questions (MCQs) for each course module
      2. Reflection Questions for deeper learning
      3. Practical Tasks/Projects
      4. Final assessment criteria
      5. Grading rubrics
      6. Self-assessment checklists
      
      Base this on the ${courses.length} courses in the program.
      
      Format in Markdown with clear sections.`;

    const assessmentPacket = await generateContent(assessmentPrompt);

    const enhancementMaterialsPrompt = `Create Enhancement Materials package including:
      1. Pre-Program Survey (10-15 questions)
      2. Welcome Packet (orientation guide)
      3. Implementation Plan (step-by-step timeline)
      4. Certificates of Completion (templates)
      5. Bonus Resources (verified books, articles, online tools)
      
      Program: ${programTitle}
      Audience: ${audience}
      
      Format in Markdown with professional presentation.`;

    const enhancementMaterials = await generateContent(enhancementMaterialsPrompt);

    const bonusResourcesPrompt = `Create Bonus Resources package with:
      1. Recommended Books (3-5, with real titles and authors)
      2. Articles and Research Papers (3-5, with specific topics)
      3. Online Tools and Platforms (3-5, actual tools)
      4. Video Content Resources (YouTube channels, course platforms)
      5. Community and Networking Resources
      
      All resources must be real and verifiable.
      
      Format in Markdown with descriptions and access links.`;

    const bonusResources = await generateContent(bonusResourcesPrompt);

    res.json({
      program_overview: programOverview,
      full_course_series: courseDocuments.join('\n\n---\n\n'),
      assessment_packet: assessmentPacket,
      enhancement_materials: enhancementMaterials,
      bonus_resources: bonusResources
    });

  } catch (error) {
    console.error('Error generating program:', error);
    res.status(500).json({ error: 'Failed to generate program' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});