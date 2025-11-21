import { useLedgerData } from "@/api/data";
import { Header } from "@/components/layout/header";
import { useSearch } from "@tanstack/react-router";
import { ThemeSwitch } from "@/components/ui/theme-switch";
import { ConfigDrawer } from "@/components/layout/config-drawer";
import { DataTable } from "./table";
import { Main } from "@/components/main";

export function Ledger() {
  // get actual params, not stringified object
  const search = useSearch({ from: "/requestor/requests/" }) as {
    filter?: string;
  };
  const { data } = useLedgerData(search);

  return (
    <>
      <Header fixed>
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ConfigDrawer />
        </div>
      </Header>
      <Main>
        {/* <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Ledger Page</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your transactions.
            </p>
          </div>
        </div>
        <TasksPrimaryButtons /> */}

        <div className="-mx-4 flex-1 overflow-disable px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          <DataTable data={data?.data ?? []} />
        </div>
      </Main>
    </>
  );
}
