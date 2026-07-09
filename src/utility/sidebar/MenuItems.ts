import { Mic, Sparkles, BookOpen, BarChart3, Settings } from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  path: string;
  disabled?: boolean;
}
export const MenuItems: MenuItem[] = [
  {
    id: "records",
    label: "Bảng ghi âm",
    icon: Mic,
    path: "/home",
  },
  {
    id: "speaking",
    label: "Luyện nói AI",
    icon: Sparkles,
    path: "/home",
  },
  {
    id: "vocabulary",
    label: "Từ vựng",
    icon: BookOpen,
    path: "/vocabulary",
    disabled: true,
  },
  {
    id: "stats",
    label: "Thống kê",
    icon: BarChart3,
    path: "/statistics",
    disabled: true,
  },
  {
    id: "settings",
    label: "Cài đặt",
    icon: Settings,
    path: "/settings",
    disabled: true,
  },
];
