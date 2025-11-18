// components/layouts/MainLayout.tsx

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./sidebar/app-sidebar";
import { LayoutProvider } from "@/context/layout-provider";
// import { Navbar } from "./nav";

interface MainLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <LayoutProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* <Navbar /> */}
          <main className="flex-1 overflow-auto">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </LayoutProvider>
  );
}
