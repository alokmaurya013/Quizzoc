const express = require('express');
const upload = require('../middlewares/multerConfig'); // Assuming Multer config is in `middlewares/multerConfig.js`
const { uploadPDF } = require('../controllers/pdfController');

const router = express.Router();

router.post('/upload', upload.single('file'), uploadPDF); // 'file' should match the Postman key
module.exports = router;
