import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./page/langdingPage/LandingPage";
import TermsPage from "./page/langdingPage/TermsPage";
import PrivacyPage from "./page/langdingPage/PrivacyPage";
import ContactPage from "./page/langdingPage/ContactPage";
import LayoutUser from "./utility/layout/LayoutUser";
import ErrorPage from "./utility/ErrorPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LayoutUser />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}
