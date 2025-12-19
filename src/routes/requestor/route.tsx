import { AuthProvider, RequireAuth } from "@/components/auth/auth";
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import { sidebarData } from "@/components/layout/sidebar/sidebar-data";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { LayoutProvider } from "@/context/layout-provider";
import { getCookie } from "@/lib/cookies";
import { cn } from "@/lib/utils";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/requestor")({
  component: RequestorLayout,
});

function RequestorLayout() {
  const defaultOpen = getCookie("sidebar_state") !== "false";

  return (
    <LayoutProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar sidebarData={sidebarData} />
        <SidebarInset
          className={cn(
            // Set content container, so we can use container queries
            "@container/content [container-type:inline-size] [container-name:content] overflow-hidden",

            // If layout is fixed, set the height
            // to 100svh to prevent overflow
            "has-[[data-layout=fixed]]:h-svh",

            // If layout is fixed and sidebar is inset,
            // set the height to 100svh - spacing (total margins) to prevent overflow
            "peer-data-[variant=inset]:has-[[data-layout=fixed]]:h-[calc(100svh-(var(--spacing)*4))]"
          )}
        >
          {/* <Navbar /> */}
          <AuthProvider>
            <RequireAuth allowedVendorTypes={["requestor"]}>
              <Outlet />
            </RequireAuth>
          </AuthProvider>
        </SidebarInset>
      </SidebarProvider>
    </LayoutProvider>
  );
}
