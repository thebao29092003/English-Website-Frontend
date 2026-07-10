import {
  Mic,
  Sparkles,
  BookOpen,
  BarChart3,
  Settings,
  Badge,
  Activity,
} from "lucide-react";

interface SubMenuItem {
  id: string;
  label: string;
  path: string;
  disabled?: boolean;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  path?: string;
  disabled?: boolean;
  children?: SubMenuItem[];
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
    children: [
      {
        id: "speaking-topic",
        label: "Nói theo chủ đề",
        path: "/home",
        icon: Badge,
      },
      {
        id: "speaking-ielts",
        label: "Luyện đề IELTS",
        path: "/home",
        icon: Activity,
      },
    ],
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
