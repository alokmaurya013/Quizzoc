import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// Upload PDF to extract and generate MCQs
export const uploadPDF = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/pdf/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; // Contains questions
  } catch (error) {
    console.error("Error uploading PDF:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch generated MCQ questions from the database
export const fetchQuiz = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/quiz`);
    return response.data.questions; // Contains questions
  } catch (error) {
    console.error("Error fetching quiz:", error.response?.data || error.message);
    throw error;
  }
};
