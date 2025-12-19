// import { useSearch } from "@tanstack/react-router";
import { Header } from "@/components/layout/header";

import { useFetchRequests } from "@/api/fetch-requests";
import { ConfigDrawer } from "@/components/layout/config-drawer";
import { Main } from "@/components/main";
import { ModeToggle } from "@/components/toggle";
import { useSearch } from "@tanstack/react-router";
import { DataTable } from "./components/table";
export function RequestsPage() {
  const search = useSearch({ from: "/requestor/requests/" }) as {
    filter?: string;
  };
  const { data } = useFetchRequests(search);
  return (
    <>
      <Header fixed>
        <div className="ms-auto flex items-center space-x-4">
          <ModeToggle />
          <ConfigDrawer />
        </div>
      </Header>
      <Main>
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Quotation Requests List
            </h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your quotation requests.
            </p>
          </div>
        </div>
        {/* <TasksPrimaryButtons /> */}

        <div className="-mx-4 flex-1 overflow-disable px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          <DataTable data={data.data ?? []} />

          {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        </div>
      </Main>
    </>
  );
}
