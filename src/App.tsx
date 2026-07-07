import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./page/langdingPage/LandingPage";
import TermsPage from "./page/langdingPage/TermsPage";
import PrivacyPage from "./page/langdingPage/PrivacyPage";
import ContactPage from "./page/langdingPage/ContactPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  );
}
