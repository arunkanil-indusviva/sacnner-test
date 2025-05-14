import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ReviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [scannedItems, setScannedItems] = useState(location.state?.scannedItems || []);
  const [selectedItems, setSelectedItems] = useState(new Set());

  const toggleItemSelection = (index) => {
    setSelectedItems((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(index)) {
        newSelected.delete(index);
      } else {
        newSelected.add(index);
      }
      return newSelected;
    });
  };

  const deleteSelectedItems = () => {
    setScannedItems((prev) => prev.filter((_, index) => !selectedItems.has(index)));
    setSelectedItems(new Set());
  };

  const goBackToScanner = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Review Scanned Items</h1>
          <div className="space-x-4">
            {selectedItems.size > 0 && (
              <button
                onClick={deleteSelectedItems}
                className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition"
              >
                Delete Selected ({selectedItems.size})
              </button>
            )}
            <button
              onClick={goBackToScanner}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
            >
              Back to Scanner
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          {scannedItems.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No items scanned yet</p>
          ) : (
            <div className="space-y-3">
              {scannedItems.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center p-4 rounded-xl transition ${
                    selectedItems.has(index) ? "bg-blue-100 border-2 border-blue-500" : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => toggleItemSelection(index)}
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.has(index)}
                    onChange={() => {}}
                    className="w-5 h-5 mr-4"
                  />
                  <span className="text-lg text-gray-800">{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-gray-600">
          <p>Click on items to select them for deletion</p>
          <p className="text-sm mt-2">Total items: {scannedItems.length}</p>
        </div>
      </div>
    </div>
  );
}
