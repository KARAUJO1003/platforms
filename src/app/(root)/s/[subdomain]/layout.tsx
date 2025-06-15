import { NavHeader } from "@/components/nav-header";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div suppressHydrationWarning>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <NavHeader />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
