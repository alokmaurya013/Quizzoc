import React from "react";
import { useLocation } from "react-router-dom";
import Quiz from "../components/Quiz";

function QuizPage() {
  const { state } = useLocation();
  const { questions } = state || { questions: [] };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">AI-Powered Quiz</h1>
      {questions.length > 0 ? (
        <Quiz questions={questions} />
      ) : (
        <p className="text-lg text-red-500">
          No questions available. Please upload a valid PDF and generate a quiz.
        </p>
      )}
    </div>
  );
}

export default QuizPage;
