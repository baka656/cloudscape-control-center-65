import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  ClipboardCheck,
  FileCog,
  Home,
  Settings,
  BookCheck,
  FileText,
  UserCog,
  Users,
} from "lucide-react";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  isAdmin: boolean;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

export function SidebarNav({ className, isAdmin, ...props }: SidebarNavProps) {
  const location = useLocation();
  
  const items: NavItem[] = [
    {
      title: "Dashboard",
      href: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Application Submissions",
      href: "/submissions",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Human Validation",
      href: "/validation",
      icon: <ClipboardCheck className="h-5 w-5" />,
    },
    {
      title: "Application Reports",
      href: "/reports",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: "Controls Management",
      href: "/controls",
      icon: <FileCog className="h-5 w-5" />,
      adminOnly: true,
    },
    {
      title: "User Management",
      href: "/users",
      icon: <Users className="h-5 w-5" />,
      adminOnly: true,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  // Filter items based on admin status
  const visibleItems = items.filter(item => !item.adminOnly || isAdmin);

  return (
    <nav
      className={cn(
        "flex w-full flex-col gap-1 p-2",
        className
      )}
      {...props}
    >
      {visibleItems.map((item) => {
        const isActive = location.pathname === item.href;
        
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-all",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            )}
          >
            {item.icon}
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
