import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import AdminPage from "./AdminPage.jsx";
import LiveScreen from "./LiveScreen.jsx"; // <--- فایل جدید

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/live" element={<LiveScreen />} /> {/* <--- مسیر جدید */}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
