import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleFile = (file) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setError("File size must be less than 3MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const fileData = {
        name: file.name,
        dataUrl: reader.result,
      };
      // Store in sessionStorage
      sessionStorage.setItem("uploadedPDF", JSON.stringify(fileData));
      // Redirect
      navigate("/chat");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setError(null);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleBrowse = (e) => {
    setError(null);
    const file = e.target.files[0];
    handleFile(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold mb-6">Upload Your PDF</h1>

      <div
        className="w-full max-w-md h-64 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-500 rounded-xl cursor-pointer hover:border-blue-500 transition mb-4"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <p className="text-center px-4">Drag & drop your PDF file here</p>
      </div>

      <label className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition">
        Browse File
        <input
          type="file"
          accept="application/pdf"
          onChange={handleBrowse}
          className="hidden"
        />
      </label>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
