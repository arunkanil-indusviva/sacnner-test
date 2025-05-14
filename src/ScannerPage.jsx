import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function ScannerPage() {
  const [scannedItems, setScannedItems] = useState([]);
  const [buffer, setBuffer] = useState("");
  const bufferRef = useRef("");
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const lastKeyTime = useRef(0);
  const SCAN_TIMEOUT = 50; // ms to consider consecutive keypresses as a single scan

  useEffect(() => {
    // Keep the hidden input focused
    inputRef.current?.focus();

    const handleKeyDown = (e) => {
      const now = Date.now();
      // Only handle printable characters and Enter
      if (e.key !== "Enter" && e.key.length !== 1) return;

      // Reset buffer if timeout exceeded
      if (now - lastKeyTime.current > SCAN_TIMEOUT) {
        bufferRef.current = "";
      }
      lastKeyTime.current = now;

      if (e.key === "Enter") {
        const code = bufferRef.current.trim();
        if (code) {
          setScannedItems((prev) => [code, ...prev]);
        }
        bufferRef.current = "";
        setBuffer("");
      } else {
        bufferRef.current += e.key;
        setBuffer(bufferRef.current);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const goToReviewPage = () => {
    if (scannedItems.length === 0) {
      alert("Please scan at least one item before reviewing");
      return;
    }
    navigate("/review", { state: { scannedItems } });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Scanned Items</h1>

      {/* Hidden input captures scanner keystrokes */}
      <input
        ref={inputRef}
        style={{ position: "absolute", opacity: 0 }}
        autoFocus
        value={buffer}
        readOnly
      />

      <div className="bg-white rounded-2xl shadow-md p-6 max-w-xl mx-auto">
        {scannedItems.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No items scanned yet. Start scanning items.
          </p>
        ) : (
          <ul className="space-y-2">
            {scannedItems.map((item, index) => (
              <li
                key={index}
                className="bg-green-100 rounded-xl px-4 py-2 text-lg text-gray-800 shadow-sm"
              >
                {item}
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={goToReviewPage}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-xl text-lg hover:bg-blue-700 transition disabled:opacity-50"
          disabled={scannedItems.length === 0}
        >
          Review All Scans ({scannedItems.length})
        </button>
      </div>
    </div>
  );
}
