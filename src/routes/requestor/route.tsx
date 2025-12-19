import { AuthProvider, RequireAuth } from "@/components/auth/auth";
import MainLayout from "@/components/layout/mainLayout";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/requestor")({
  component: RequestorLayout,
});

function RequestorLayout() {
  return (
    <AuthProvider>
      <RequireAuth>
        <MainLayout>
          <Outlet />
        </MainLayout>
      </RequireAuth>
    </AuthProvider>
  );
}
