import {
  Accessibility,
  BarChart3,
  Banknote,
  BookOpen,
  ClipboardCheck,
  ClipboardList,
  FileCheck2,
  IdCard,
  LayoutDashboard,
  Settings,
  Shield,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  restricted?: boolean;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "People",
    items: [
      { label: "Pupils", href: "/pupils", icon: Users },
      { label: "Parents & Carers", href: "/parents-and-carers", icon: Users },
      { label: "Staff Directory", href: "/staff-directory", icon: IdCard },
      { label: "Admissions", href: "/admissions", icon: ClipboardCheck, badge: "8" },
    ],
  },
  {
    label: "Attendance & Welfare",
    items: [
      { label: "Attendance", href: "/attendance", icon: ClipboardList },
      { label: "Safeguarding", href: "/safeguarding", icon: Shield, restricted: true },
      { label: "SEND & Welfare", href: "/send-welfare", icon: Accessibility },
    ],
  },
  {
    label: "Teaching & Learning",
    items: [
      { label: "Curriculum & Classes", href: "/curriculum-and-classes", icon: BookOpen },
      { label: "Assessments & Exams", href: "/assessments-and-exams", icon: BarChart3 },
      { label: "Timetables", href: "/timetables", icon: ClipboardList },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Finance & Fees", href: "/finance-and-fees", icon: Banknote },
      { label: "Census & SCR", href: "/statutory-census-and-scr", icon: FileCheck2 },
      { label: "Administration", href: "/system-settings", icon: Settings },
    ],
  },
];
