import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function ScannerPage() {
  const [scannedItems, setScannedItems] = useState([]);
  const [buffer, setBuffer] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const lastKeyTime = useRef(0);
  const SCAN_TIMEOUT = 50; // milliseconds between keypresses to consider it a barcode scan

  useEffect(() => {
    // Auto focus input
    inputRef.current?.focus();

    const handleKeyDown = (e) => {
      const currentTime = new Date().getTime();
      
      // Ignore modifier keys and special keys
      if (e.key === "Shift" || e.key === "CapsLock" || e.key === "Control" || 
          e.key === "Alt" || e.key === "Meta" || e.key === "Tab") {
        return;
      }

      // If it's been too long since the last keypress, clear the buffer
      if (currentTime - lastKeyTime.current > 100) {
        setBuffer("");
      }

      // Update the last keypress time
      lastKeyTime.current = currentTime;

      if (e.key === "Enter") {
        if (buffer.trim()) {
          setScannedItems((prev) => [buffer.trim(), ...prev]);
          setBuffer("");
        }
      } else {
        // Only add printable characters to the buffer
        if (e.key.length === 1) {
          setBuffer((prev) => prev + e.key);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [buffer]);

  const goToReviewPage = () => {
    console.log("Navigating to review page with items:", scannedItems);
    if (scannedItems.length === 0) {
      alert("Please scan at least one item before reviewing");
      return;
    }
    navigate("/review", { state: { scannedItems } });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Scanned Items</h1>

      <input 
        ref={inputRef} 
        style={{ position: "absolute", opacity: 0 }} 
        autoFocus 
        value={buffer}
        onChange={(e) => setBuffer(e.target.value)}
      />

      <div className="bg-white rounded-2xl shadow-md p-6 max-w-xl mx-auto">
        {scannedItems.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No items scanned yet. Start scanning items.</p>
        ) : (
          <ul className="space-y-2">
            {scannedItems.map((item, index) => (
              <li key={index} className="bg-green-100 rounded-xl px-4 py-2 text-lg text-gray-800 shadow-sm">
                {item}
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={goToReviewPage}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-xl text-lg hover:bg-blue-700 transition"
          disabled={scannedItems.length === 0}
        >
          Review All Scans ({scannedItems.length})
        </button>
      </div>
    </div>
  );
}
