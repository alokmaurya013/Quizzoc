const Question = require("../models/questionModel");

exports.getQuiz = async (req, res) => {
  try {
    //
    const questions = await Question.find();

    // Respond with the questions
    res.status(200).json({
      success: true,
      questions,
    });
  } catch (error) {
    console.error("Error fetching quiz:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
