import MainLayout from "@/components/layout/mainLayout";
import { ThemeProvider } from "@/components/theme";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";

export const Route = createRootRoute({
  component: () => (
    <>
      {/* <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      /> */}
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <MainLayout>
          <NuqsAdapter>
            <Outlet />
          </NuqsAdapter>
        </MainLayout>
      </ThemeProvider>
    </>
  ),
});
