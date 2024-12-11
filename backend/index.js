const express = require('express');
const mongoose = require('mongoose');
const cors=require('cors');
const dotenv = require('dotenv');
const pdfRoutes = require('./routes/pdfRoutes');
const quizRoutes = require('./routes/quizRoutes');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
// Routes
app.use('/api/pdf', pdfRoutes);
app.use('/api/quiz', quizRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
