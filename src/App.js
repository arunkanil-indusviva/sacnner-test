import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScannerPage from "./ScannerPage";
import ReviewPage from "./ReviewPage";

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<ScannerPage />} />
          <Route path="/review" element={<ReviewPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
