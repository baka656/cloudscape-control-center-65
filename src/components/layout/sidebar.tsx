
import * as React from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, CloudCog } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isAdmin: boolean;
}

export function Sidebar({ isAdmin }: SidebarProps) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r bg-sidebar transition-all duration-300",
        collapsed ? "w-[60px]" : "w-[280px]"
      )}
    >
      <div className="flex h-14 items-center border-b px-4">
        <div className={cn("flex items-center gap-2", collapsed && "justify-center w-full")}>
          <CloudCog className="h-6 w-6 text-secondary" />
          {!collapsed && <span className="font-semibold text-sidebar-foreground">Cloudscape Controls</span>}
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto">
        <SidebarNav isAdmin={isAdmin} className={cn(collapsed && "items-center p-0")} />
      </div>

      <div className="flex items-center justify-between border-t p-4">
        {!collapsed && <ThemeToggle />}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("rounded-sm", collapsed && "w-full")}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
