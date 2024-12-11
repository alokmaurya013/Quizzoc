const pdf = require('pdf-parse');

// Function to parse PDF content and extract questions with answers
exports.parsePDF = async (pdfBuffer) => {
  try {
    if (!pdfBuffer || !(pdfBuffer instanceof Buffer)) {
      throw new Error('Invalid input: PDF data must be a Buffer');
    }

    const parsedData = await pdf(pdfBuffer);
    const text = parsedData.text;

    // Extract questions and answers
    const questions = extractQuestionsFromText(text);

    // Log extracted questions for debugging
   // console.log('Parsed Questions and Answers:', questions);
    return questions;
  } catch (error) {
    console.error('Error parsing PDF:', error.message);
    throw new Error('Failed to parse PDF');
  }
};

// Function to extract questions and answers from text
function extractQuestionsFromText(text) {
  const lines = text.split('\n');
  const questions = [];
  let currentQuestion = null;

  lines.forEach((line) => {
    // Detect lines that look like a question (e.g., "Q1.", "Q2.")
    if (line.match(/^Q\d+\./)) {
      // Push the previous question if it exists
      if (currentQuestion) {
        questions.push(currentQuestion);
      }

      // Start a new question
      currentQuestion = { question: line.trim(), answer: '' };
    } else if (currentQuestion && line.trim()) {
      // Add the current line to the answer if it exists
      currentQuestion.answer += `${line.trim()} `;
    }
  });

  // Push the last question if it exists
  if (currentQuestion) {
    questions.push(currentQuestion);
  }

  // Clean up answers (remove trailing spaces)
  questions.forEach((q) => {
    q.answer = q.answer.trim();
  });

  return questions;
}
