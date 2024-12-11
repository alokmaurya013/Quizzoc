import React, { useState } from "react";
import { uploadPDF } from "../services/api";
import { useNavigate } from "react-router-dom";

function UploadPDF() {
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile) return alert("Please select a PDF file to upload.");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", pdfFile);

    try {
      const { questions } = await uploadPDF(formData);
      navigate("/quiz", { state: { questions } });
    } catch (error) {
      console.error("Error during PDF upload:", error);
      alert("Failed to process the PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full mx-auto">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Upload Your PDF Question Paper
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
        />
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 text-white rounded-md transition-colors ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Processing..." : "Generate Quiz"}
        </button>
      </form>
    </div>
  );
}

export default UploadPDF;
