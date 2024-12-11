import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Quiz({ questions, totalQuizTime = 30 }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]); // Store selected options for each question
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(totalQuizTime); // Global timer for the quiz
  const [timeTaken, setTimeTaken] = useState(0); // Time taken to complete the quiz
  const [timerInterval, setTimerInterval] = useState(null); // Store the interval ID to clear it

  const navigate = useNavigate(); // Hook to navigate between pages
  const currentQuestion = questions[currentQuestionIndex];

  // Handle global timer countdown
  useEffect(() => {
    // If quiz is completed, stop the timer
    if (quizCompleted) {
      clearInterval(timerInterval);
      return;
    }

    // Clear any previous interval
    if (timerInterval) clearInterval(timerInterval);

    const timer = setInterval(() => {
      setTimeTaken((prevTimeTaken) => prevTimeTaken + 1);
      setTimeLeft((prevTime) => {
        if (prevTime < 1) {
          handleSubmit(); // Automatically submit the quiz when time runs out
          return 0; // Ensure `timeLeft` never goes below 0
        }
        return prevTime - 1;
      });
    }, 1000);

    setTimerInterval(timer);

    // Cleanup timer on component unmount or when quiz is completed
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Handle option change for each question
  const handleOptionChange = (e) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestionIndex] = e.target.value;
    setSelectedOptions(newSelectedOptions);

    // Update score based on the current selected option
    const updatedScore = newSelectedOptions.reduce((acc, option, index) => {
      if (option === questions[index].correctAnswer) {
        return acc + 1;
      }
      return acc;
    }, 0);

    setScore(updatedScore);
  };

  // Move to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit(); // Submit if it's the last question
    }
  };

  // Move to previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Handle quiz submit
  const handleSubmit = () => {
    clearInterval(timerInterval); // Clear the timer interval when quiz is submitted
    setTimeTaken(totalQuizTime - timeLeft); // Ensure timeTaken is correct
    setQuizCompleted(true);
  };

  // Navigate to the home page
  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full mx-auto">
      {!quizCompleted ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h2>
            <p className="text-red-500 font-bold">Time Left: {timeLeft}s</p>
          </div>
          <p className="text-gray-800 mb-6">{currentQuestion.question}</p>
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <label
                key={index}
                className="flex items-center space-x-2 text-gray-700"
              >
                <input
                  type="radio"
                  name="option"
                  value={option}
                  checked={selectedOptions[currentQuestionIndex] === option}
                  onChange={handleOptionChange}
                  className="h-4 w-4"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className={`px-4 py-2 text-white rounded-md transition-colors ${
                currentQuestionIndex === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              Previous
            </button>
            <button
              onClick={handleNextQuestion}
              className={`px-4 py-2 text-white rounded-md transition-colors ${
                "bg-green-500 hover:bg-green-600"
              }`}
            >
              {currentQuestionIndex < questions.length - 1
                ? "Next Question"
                : "Submit Quiz"}
            </button>
          </div>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-500 mb-4">
            Quiz Completed!
          </h2>
          <p className="text-lg text-gray-700">
            Your Score: {score}/{questions.length}
          </p>
          <p className="text-lg text-gray-500">
            Time Taken: {timeTaken}s / {totalQuizTime}s
          </p>
          <button
            onClick={handleGoHome}
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Go to Home Page
          </button>
        </div>
      )}
    </div>
  );
}

export default Quiz;
