import { useState } from "react";
import Hero from "../../component/landing/Hero";
import AISandbox from "../../component/landing/AISandbox";
import Features from "../../component/landing/Features";
import FAQ from "../../component/landing/FAQ";
import AuthModal from "../../component/landing/AuthModal";
import ScrollToTop from "../../utility/ScrollToTop";

export default function LandingPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");

  const handleOpenAuth = (tab: "login" | "signup") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  // const handlePlanSelect = () => {
  //   handleOpenAuth("signup");
  // };

  return (
    <div
      id="landing-page-root"
      className="min-h-screen bg-[#030014] text-white dark"
    >
      {/* Main Sections */}
      <main>
        {/* Modern dark technology Hero section */}
        <Hero onOpenAuth={handleOpenAuth} />

        {/* Real-time speaking sandbox assessment panel */}
        <AISandbox />

        {/* 5-Dimension metrics detailed descriptions */}
        <Features onOpenAuth={handleOpenAuth} />

        {/* Dynamic Pricing options */}
        {/* TẠM THỜI BỎ QUA */}
        {/* <Pricing onPlanSelect={handlePlanSelect} /> */}

        {/* FAQs */}
        <FAQ />
      </main>

      {/* Login / Register Overlay modals */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialTab={authTab}
      />

      {/* Scroll-to-top floating button */}
      <ScrollToTop />
    </div>
  );
}
