const { parsePDF } = require('../utils/pdfParser');
const Question = require('../models/questionModel');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

exports.uploadPDF = async (req, res) => {
  try {
    // Ensure a file was uploaded
    if (!req.file) {
      console.log('No file was uploaded.');
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    //console.log('PDF file received. Starting to parse...');
    const pdfBuffer = req.file.buffer;

    // Step 1: Parse PDF to extract questions and answers
    const extractedQuestions = await parsePDF(pdfBuffer);
    //console.log('Extracted Questions:', JSON.stringify(extractedQuestions, null, 2));

    // If no questions were extracted
    if (!extractedQuestions || extractedQuestions.length === 0) {
     // console.log('No questions extracted from the PDF.');
      return res.status(400).json({ success: false, error: 'No valid questions found in the PDF.' });
    }

    // Step 2: Generate AI-powered MCQs
   // console.log('Starting AI-based MCQ generation...');
    const aiGeneratedQuestions = await generateAIQuestions(extractedQuestions);
   console.log('AI-Generated Questions:', JSON.stringify(aiGeneratedQuestions, null, 2));

    // If AI failed to generate any questions
    if (!aiGeneratedQuestions || aiGeneratedQuestions.length === 0) {
      console.log('No MCQs generated by the AI.');
      return res.status(500).json({ success: false, error: 'Failed to generate MCQs.' });
    }

    // Step 3: Save questions to the database with proper numbering
    const numberedQuestions = aiGeneratedQuestions.map((question, index) => ({
      number: `Q${index + 1}`, // Add numbering (Q1, Q2, ...)
      question: question.question, // Shorten long questions
      options: question.options,
      correctAnswer: question.correctAnswer,
    }));
    const savedQuestions = await Question.insertMany(numberedQuestions);

    console.log('Questions successfully saved to the database.');
    res.status(201).json({ success: true, questions: savedQuestions });
  } catch (error) {
    console.error('Error uploading file:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

async function generateAIQuestions(extractedQuestions) {
  const questionsWithOptions = [];

  for (const { question, answer } of extractedQuestions) {
    const prompt = `
      Generate a multiple-choice question based on:
      Question: "${question}"
      Correct Answer: "${answer}" from options.
      Provide 4 options, including the correct answer, in the format:
      a) Option A
      b) Option B
      c) Option C
      d) Option D
    `;

    try {
      const result = await model.generateContent(prompt);
      const aiGeneratedText = typeof result.response.text === 'function'
        ? await result.response.text()
        : result.response.text;

      console.log(`AI Response for question "${question}":`, aiGeneratedText);

      // Process the AI response to extract options and correctAnswer
      const { options, correctAnswer } = processAIResponse(aiGeneratedText);

      const aiQuestion = {
        question: question.trim(),
        options: options,
        correctAnswer: correctAnswer,
      };

      questionsWithOptions.push(aiQuestion);
    } catch (error) {
      console.error(`Error generating question for "${question}":`, error.message);
    }
  }

  return questionsWithOptions;
}

// Helper function to process AI response
function processAIResponse(aiResponse) {
  const lines = aiResponse.split('\n').filter((line) => line.trim().length > 0);

  // Extract options from AI response (ensure options are split correctly)
  const options = lines
    .filter(line => line.match(/^[a-d]\)/)) // Match options like "a)", "b)", etc.
    .map(line => line.trim()); // Remove extra spaces
  
  // Extract the correct answer from the lines
  const correctAnswerLine = lines.find(line => line.includes('Correct Answer:'));
  const correctAnswer = correctAnswerLine ? correctAnswerLine.split('Correct Answer:')[1].trim() : options[0]; // Default to first option if not found

  // Return options and correct answer
  return { options, correctAnswer };
}