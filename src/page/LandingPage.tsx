import React, { useState } from "react";
import Navbar from "../component/landing/Navbar";
import Hero from "../component/landing/Hero";
import AISandbox from "../component/landing/AISandbox";
import Features from "../component/landing/Features";
import Pricing from "../component/landing/Pricing";
import FAQ from "../component/landing/FAQ";
import Footer from "../component/landing/Footer";
import AuthModal from "../component/landing/AuthModal";

export default function LandingPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");
  const isDark = true;

  const handleOpenAuth = (tab: "login" | "signup") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  const handleScrollToSandbox = () => {
    const sandbox = document.getElementById("ai-sandbox-section");
    if (sandbox) {
      sandbox.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePlanSelect = (planId: string) => {
    // If selecting a plan, prompt user to register or log in first
    handleOpenAuth("signup");
  };

  return (
    <div
      id="landing-page-root"
      className="min-h-screen bg-[#030014] text-white dark"
    >
      {/* Sticky Top Navbar */}
      <Navbar onOpenAuth={handleOpenAuth} />

      {/* Main Sections */}
      <main>
        {/* Modern dark technology Hero section */}
        <Hero onOpenAuth={handleOpenAuth} />

        {/* Real-time speaking sandbox assessment panel */}
        <AISandbox />

        {/* 5-Dimension metrics detailed descriptions */}
        <Features />

        {/* Dynamic Pricing options */}
        <Pricing onPlanSelect={handlePlanSelect} />

        {/* FAQs */}
        <FAQ />
      </main>

      {/* Footer bar */}
      <Footer />

      {/* Login / Register Overlay modals */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialTab={authTab}
        isDark={isDark}
      />
    </div>
  );
}
