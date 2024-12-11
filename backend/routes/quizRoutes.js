const express = require('express');
const { generateQuestions, getQuiz } = require('../controllers/quizController');

const router = express.Router();

router.get('/', getQuiz);

module.exports = router;
