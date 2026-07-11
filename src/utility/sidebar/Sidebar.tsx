import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../API/hooks/hooks";
import { selectCurrentUser, logout } from "../../API/auth/authSlice";
import { useLogoutMutation } from "../../API/auth/logoutApi";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  LogOut,
  X,
} from "lucide-react";
import { showSuccessMessage } from "../notification";
import { showConfirmDialog } from "../confirmDialog";
import { MenuItems } from "./MenuItems";
import { useState } from "react";

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
  const [logoutTrigger] = useLogoutMutation();

  // State lưu danh sách các ID menu cha đang được mở
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});

  const toggleSubMenu = (menuId: string) => {
    // Nếu Sidebar đang thu nhỏ, tự động phóng to ra trước khi mở menu con
    if (isCollapsed) {
      setIsCollapsed(false);
    }
    setOpenSubMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };
  const handleLogout = () => {
    showConfirmDialog({
      title: "Xác nhận đăng xuất",
      message: "Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?",
      confirmText: "Đăng xuất",
      cancelText: "Hủy bỏ",
      onConfirm: async () => {
        try {
          await logoutTrigger().unwrap();
        } catch (error) {
          console.error("Logout API error:", error);
        }
        dispatch(logout());
        showSuccessMessage("Đăng xuất thành công");
        navigate("/");
      },
    });
  };

  const handleNavigation = (item: (typeof MenuItems)[0]) => {
    if (item.disabled) return;
    if (item.children) {
      // Nếu click vào mục có menu con -> đóng/mở menu con
      toggleSubMenu(item.id);
    } else if (item.path) {
      // Nếu click vào mục đơn -> điều hướng và đóng menu mobile
      setMobileOpen(false);
      navigate(item.path);
    }
  };

  const getUserDisplayName = () => {
    if (!currentUser) return "Học viên EngSteps";
    if (currentUser.Email) {
      return currentUser.Email.split("@")[0];
    }
    return "User";
  };

  const getActiveItem = () => {
    for (const item of MenuItems) {
      if (item.disabled) continue;

      // Nếu đường dẫn khớp trực tiếp với mục cha
      if (item.path && location.pathname === item.path) {
        return item.id;
      }

      // Hoặc khớp với một trong các mục con của nó
      if (item.children) {
        const activeChild = item.children.find(
          (child) => location.pathname === child.path,
        );
        if (activeChild) return activeChild.id;
      }
    }
    return "records";
  };

  const activeItem = getActiveItem();

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
          <div className="flex items-center lg:justify-between justify-center p-4 h-16 border-b border-white/5">
            <div
              className="flex items-center gap-3 overflow-hidden cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="hidden lg:flex w-8 h-8 shrink-0 bg-linear-to-br from-blue-500 to-violet-600 rounded-lg  items-center justify-center shadow-lg shadow-blue-500/20">
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
              <X size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 mt-4">
            {MenuItems.map((item) => {
              const Icon = item.icon;
              // Mục cha được coi là Active nếu chính nó active hoặc có con của nó active
              const isParentActive =
                activeItem === item.id ||
                (item.children &&
                  item.children.some((child) => child.id === activeItem));
              const hasChildren = !!item.children;
              const isSubMenuOpen = !!openSubMenus[item.id];

              return (
                <div key={item.id} className="space-y-1">
                  <button
                    onClick={() => handleNavigation(item)}
                    disabled={item.disabled}
                    className={`w-full flex items-center cursor-pointer gap-3.5 py-3 px-3.5 rounded-xl font-medium text-sm transition-all duration-200 text-left
                    ${item.disabled ? "opacity-40 cursor-default" : ""}
                    ${
                      isParentActive
                        ? "bg-linear-to-r from-blue-500/10 to-purple-500/10 border-l-3 border-purple-500 text-white shadow-md shadow-purple-500/5 font-semibold"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }
                  `}
                  >
                    <Icon
                      size={20}
                      className={
                        isParentActive ? "text-purple-400" : " text-slate-400"
                      }
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
                    {/* Hiển thị mũi tên đóng/mở nếu có menu con */}
                    {hasChildren && !isCollapsed && (
                      <span className="text-slate-500 transition-all duration-2500">
                        {isSubMenuOpen ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )}
                      </span>
                    )}
                  </button>

                  {/* Render danh sách Menu con nếu có và đang mở */}
                  {hasChildren && isSubMenuOpen && !isCollapsed && (
                    <div className="pl-5 space-y-1 transition-all duration-300 ">
                      {item.children?.map((child) => {
                        const isChildActive = activeItem === child.id;
                        const ChildIcon = child.icon;

                        return (
                          <button
                            key={child.id}
                            disabled={child.disabled}
                            onClick={() => {
                              if (child.disabled) return;
                              setMobileOpen(false);
                              navigate(child.path);
                            }}
                            className={`w-full flex items-center gap-3.5 py-2.5 px-3 rounded-lg font-medium  transition-all duration-200 text-left cursor-pointer
                              ${child.disabled ? "opacity-40 cursor-default" : "cursor-pointer"}
                              ${
                                isChildActive
                                  ? "text-purple-400 font-semibold"
                                  : "text-slate-500 hover:text-slate-200"
                              }
                                `}
                          >
                            {/* Hiển thị icon riêng của menu con, hoặc chấm tròn nhỏ mặc định */}
                            {ChildIcon ? <ChildIcon size={14} /> : <></>}
                            <span className="flex-1 truncate text-[13px]">
                              {child.label}
                              {child.disabled && (
                                <span className="ml-2 text-[8px] font-mono py-0.5 px-1.5 rounded-full bg-white/5 text-slate-600 border border-white/5">
                                  Sắp có
                                </span>
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile Section */}
        <div className="p-3 border-t border-white/5">
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-4 py-2">
              <div
                title={`${getUserDisplayName()} (${currentUser?.Email || "Học viên"})`}
                className="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md border border-purple-500/50 cursor-pointer select-none"
              >
                {getUserDisplayName().substring(0, 2).toUpperCase()}
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
                    {currentUser?.Email || "student@engsteps.ai"}
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
