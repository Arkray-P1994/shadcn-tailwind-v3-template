import { Cross2Icon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { debounce, useQueryState } from "nuqs";
import {
  DataTableFacetedFilter,
  DataTableViewOptions,
} from "@/components/data-table";
import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

type DataTableToolbarProps<TData> = {
  table: Table<TData>;
  searchPlaceholder?: string;
  searchKey?: string;
  filters?: {
    columnId: string;
    title: string;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
};

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = "Filter...",
  filters = [],
}: DataTableToolbarProps<TData>) {
  // Global filter query state
  const [filter, setfilter] = useQueryState("filter", {
    defaultValue: "",
    shallow: false,
    limitUrlUpdates: debounce(500),
  });

  // Other query params we want to clear/reset when a new filter is applied
  const [, setPage] = useQueryState("page", { defaultValue: "1" });

  const handleSearchChange = (value: string | null) => {
    setPage(null);
    // update the filter (this already debounces URL updates)
    setfilter(value);
    // clear other params whenever a new filter is applied
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <Input
          placeholder={searchPlaceholder}
          value={filter}
          onChange={(e) => handleSearchChange(e.target.value || null)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <div className="flex gap-x-2">
          {filters.map((f) => {
            const column = table.getColumn(f.columnId);
            if (!column) return null;
            return (
              <DataTableFacetedFilter
                key={f.columnId}
                column={column}
                title={f.title}
                options={f.options}
                // pass a callback so the faceted filter can trigger a params reset too
              />
            );
          })}
        </div>

        {filter && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              table.setGlobalFilter("");
              // clear query state too
              setfilter("");
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ms-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex gap-2">
        <DataTableViewOptions table={table} />
        <Link to={"/requestor/requests/create"}>
          <Button size="sm">
            <Plus />
            New Quotation
          </Button>
        </Link>
      </div>
    </div>
  );
}
