import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./page/LandingPage";
import TermsPage from "./page/TermsPage";
import PrivacyPage from "./page/PrivacyPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Routes>
    </BrowserRouter>
  );
}
