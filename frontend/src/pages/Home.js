import React from "react";
import UploadPDF from "../components/UploadPDF";

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        AI-Powered Quiz Generator
      </h1>
      <UploadPDF />
    </div>
  );
}

export default Home;
