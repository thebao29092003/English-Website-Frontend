import { Routes, Route } from "react-router-dom";
import LandingPage from "./page/langdingPage/LandingPage";
import TermsPage from "./page/langdingPage/TermsPage";
import PrivacyPage from "./page/langdingPage/PrivacyPage";
import ContactPage from "./page/langdingPage/ContactPage";
import ForgotPasswordStep1 from "./component/forgotPassword/ForgotPasswordStep1";
import ForgotPasswordStep2 from "./component/forgotPassword/ForgotPasswordStep2";
import HomePage from "./page/homePage/HomePage";
import LayoutUser from "./utility/layout/LayoutUser";
import ErrorPage from "./utility/ErrorPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LayoutUser />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordStep1 />} />
          <Route path="/reset-password" element={<ForgotPasswordStep2 />} />
        </Route>
        <Route path="/home" element={<HomePage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

