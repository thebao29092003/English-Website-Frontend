import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import { useState } from "react";

export default function LayoutUserHome() {
  // Sidebar Layout States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#030014] text-white flex">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />
      {/* Main Content Area */}
      <div
        className={`flex-1 min-h-screen flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        <Outlet context={{ isSidebarCollapsed, setMobileSidebarOpen }} />
      </div>
    </div>
  );
}
