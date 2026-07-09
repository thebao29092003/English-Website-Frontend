import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../API/hooks/hooks";
import { selectCurrentUser, logout } from "../../API/auth/authSlice";
import { ChevronLeft, ChevronRight, LogOut, X } from "lucide-react";
import { showSuccessMessage } from "../notification";
import { MenuItems } from "./MenuItems";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

  const handleLogout = () => {
    // dispatch(logout());
    showSuccessMessage("Đăng xuất thành công");
    navigate("/");
  };

  const handleNavigation = (item: (typeof MenuItems)[0]) => {
    if (item.disabled) return;
    setMobileOpen(false);
    navigate(item.path);
  };

  const getUserDisplayName = () => {
    if (!currentUser) return "Học viên EngSteps";
    return currentUser.toString();
  };

  const activeItem =
    MenuItems.find((item) => {
      if (item.disabled) return false;
      return location.pathname === item.path;
    })?.id || "records";

  return (
    <>
      {/* Mobile Menu Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 h-screen z-45 bg-[#030014]/90 border-r border-white/5 backdrop-blur-md flex flex-col justify-between transition-all duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "w-20" : "w-64"}
        `}
      >
        {/* Top Header - Logo and Collapse Toggle */}
        <div>
          <div className="flex items-center justify-between p-4 h-16 border-b border-white/5">
            <div
              className="flex items-center gap-3 overflow-hidden cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="w-8 h-8 shrink-0 bg-linear-to-br from-blue-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="font-black text-xs italic text-white">ES</span>
              </div>
              {!isCollapsed && (
                <span className="font-display text-lg font-bold tracking-tight bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent truncate">
                  EngSteps <span className="text-purple-400 text-xs">AI</span>
                </span>
              )}
            </div>
            {/* Collapse toggle (desktop only) */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex w-7 h-7 rounded-full bg-white/5 border border-white/10 items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer shadow-sm absolute -right-3.5 top-4.5"
            >
              {isCollapsed ? (
                <ChevronRight size={14} />
              ) : (
                <ChevronLeft size={14} />
              )}
            </button>
            {/* Close toggle (mobile only) */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 mt-4">
            {MenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  disabled={item.disabled}
                  className={`w-full flex items-center gap-3.5 py-3 px-3.5 rounded-xl font-medium text-sm transition-all duration-200 text-left
                    ${item.disabled ? "opacity-40 cursor-default" : ""}
                    ${
                      isActive
                        ? "bg-linear-to-r from-blue-500/10 to-purple-500/10 border-l-3 border-purple-500 text-white shadow-md shadow-purple-500/5 font-semibold"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  <Icon
                    size={20}
                    className={isActive ? "text-purple-400" : " text-slate-400"}
                  />
                  {!isCollapsed && (
                    <span className="flex-1 truncate">
                      {item.label}
                      {item.disabled && (
                        <span className="ml-2 text-[9px] font-mono py-0.5 px-1.5 rounded-full bg-white/5 text-slate-500 border border-white/5">
                          Sắp có
                        </span>
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile Section */}
        <div className="p-3 border-t border-white/5">
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-4 py-2">
              <div
                title={`${getUserDisplayName()} (${currentUser?.email || "Học viên"})`}
                className="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md border border-purple-500/50 cursor-pointer select-none"
              >
                {getUserDisplayName()}
              </div>
              <button
                onClick={handleLogout}
                title="Đăng xuất"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 py-2">
              <div className="flex items-center gap-3 p-1.5 rounded-xl bg-white/2 border border-white/5">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md border border-purple-500/50 shrink-0 select-none">
                  {getUserDisplayName().substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-sm font-semibold text-white leading-tight truncate">
                    {getUserDisplayName()}
                  </h4>
                  <p className="text-[10px] font-mono text-slate-500 truncate mt-0.5">
                    {currentUser?.email || "student@engsteps.ai"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-3.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer bg-white/2 border border-white/5 text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20"
              >
                <LogOut size={16} />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
