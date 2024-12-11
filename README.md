# Quizzoc

Quizzoc is an AI-powered quiz generator that allows users to upload PDF files, extract questions, and automatically generate a quiz. The application processes the PDF to identify questions and answers, then generates multiple-choice questions (MCQs) using AI. The generated quiz can be answered interactively on a frontend.
LIVE URL=https://quizzoc013.netlify.app/
## Features
- **Upload PDF**: Users can upload a PDF file containing questions, and the system will automatically parse and extract them.
- **AI-powered MCQs**: The extracted questions are processed to generate multiple-choice questions (MCQs) with options.
- **Interactive Quiz**: Users can take the generated quiz on a simple web interface.
- **Timer**: A timer for each question and for the whole quiz.

## Tech Stack
- **Backend**: Node.js, Express.js
- **Frontend**: React
- **Database**: MongoDB (for storing questions)
- **AI Integration**: Uses an AI API to generate MCQs (e.g., Google Generative AI)
- **File Processing**: PDF.js for PDF parsing

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB instance running (or MongoDB Atlas if you prefer a cloud database)
- Google Generative AI API credentials (if using for MCQ generation)

### 1. Clone the repository

```bash
git clone https://github.com/alokmaurya013/Quizzoc.git
cd Quizzoc
```

### 2. Install dependencies

#### Backend (API)
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 3. Set up environment variables

Create a `.env` file in the backend directory with the following variables:

```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_generative_ai_api_key
```

### 4. Run the Application

#### Start the Backend
```bash
cd backend
npm run dev
```

#### Start the Frontend
```bash
cd frontend
npm start
```

Your app should now be running on `http://localhost:3000` (frontend) and `http://localhost:5000` (backend).

## API Routes

### `/api/pdf/upload`

**Method**: `POST`

This endpoint allows users to upload a PDF file containing questions. The backend will parse the PDF, extract the questions, and generate multiple-choice questions (MCQs) using AI.

#### Request

- **Content-Type**: `multipart/form-data`
- **Body**: A PDF file to upload.

Example using **Postman** or **cURL**:

```bash
POST /api/pdf/upload
Content-Type: multipart/form-data
Body: { file: <your_pdf_file> }
```

#### Response

```json
{
  "success": true,
  "questions": [
    {
      "question": "What is Prolog?",
      "options": [
        "a) A declarative programming language",
        "b) A procedural programming language",
        "c) An object-oriented programming language",
        "d) A scripting language"
      ],
      "correctAnswer": "a"
    },
    {
      "question": "What is a fact in Prolog?",
      "options": [
        "a) A statement that is always true",
        "b) A statement that is always false",
        "c) A procedural function",
        "d) An algorithm"
      ],
      "correctAnswer": "c"
    }
  ]
}
```

### `/api/quiz`

**Method**: `GET`

This endpoint returns the generated quiz questions. This is used to get the quiz after a PDF has been uploaded and processed.

#### Request

```bash
GET /api/quiz
```

#### Response

```json
{
  "questions": [
    {
      "question": "What is Prolog?",
      "options": [
        "a) A declarative programming language",
        "b) A procedural programming language",
        "c) An object-oriented programming language",
        "d) A scripting language"
      ],
      "correctAnswer": "a"
    },
    {
      "question": "What is a fact in Prolog?",
      "options": [
        "a) A statement that is always true",
        "b) A statement that is always false",
        "c) A procedural function",
        "d) An algorithm"
      ],
      "correctAnswer": "c"
    }
  ]
}
```

## Folder Structure

```plaintext
quizzoc/
├── backend/
│   ├── controllers/
│   │   ├── pdfController.js
│   │   ├── quizController.js
│   └── routes/
│   |   ├── pdfRoutes.js
│   |   ├── quizRoutes.js
│   └── models/
│   │   ├── questionModel.js
│   └── middlewares/
│   │   ├── multerConfig.js
│   ├── app.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Quiz.js
│   │   │   ├── UploadPDF.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── QuizPage.js
│   │   └── App.js
│   └── public/
│   └── package.json
└── .env
```

## Conclusion

This application allows users to upload a PDF, generate multiple-choice questions using AI, and take the quiz interactively with a timer. You can extend the functionality by adding features like user authentication, quiz result storage, and more
