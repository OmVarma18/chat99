import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist";

// Manually set worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;


export default function Chat() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState("");

  const pdfData = JSON.parse(sessionStorage.getItem("uploadedPDF"));

  // Show first chat message on load
  useEffect(() => {
    if (!pdfData) {
      navigate("/");
      return;
    }

    setChatHistory([
      {
        sender: "bot",
        text: "I have read the PDF. Now please ask any questions needed.",
      },
    ]);

    renderPDF(pdfData.dataUrl);
  }, []);

  // Render the PDF's first page
  const renderPDF = async (dataUrl) => {
    const loadingTask = pdfjsLib.getDocument(dataUrl);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.5 });

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport }).promise;
  };

  // Handle user message submit
  const handleSend = async () => {
    if (!userInput.trim()) return;

    const newChat = [...chatHistory, { sender: "user", text: userInput }];
    setChatHistory(newChat);
    setUserInput("");

    // Simulate bot reply
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", text: "This is a placeholder response." },
      ]);
    }, 1000);
  };

  return (
    <div className="h-screen flex flex-col md:flex-row">
      {/* PDF viewer */}
      <div className="w-full md:w-1/2 p-4 overflow-auto bg-gray-100">
        <h2 className="text-lg font-semibold mb-2">{pdfData?.name}</h2>
        <canvas ref={canvasRef} className="border rounded shadow" />
      </div>

      {/* Chat section */}
      <div className="w-full md:w-1/2 p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg max-w-[80%] ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white self-end ml-auto"
                  : "bg-gray-200 text-gray-900 self-start"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 border px-4 py-2 rounded-lg"
            placeholder="Ask something..."
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
