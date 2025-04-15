
import * as React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Outlet } from "react-router-dom";

interface AppShellProps {
  userName?: string;
  userRole?: string;
  isAdmin?: boolean;
}

export function AppShell({ 
  userName = "John Doe", 
  userRole = "Administrator", 
  isAdmin = true 
}: AppShellProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar isAdmin={isAdmin} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header userName={userName} userRole={userRole} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
