import { DataTableToolbar } from "@/components/data-table/index";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTableUrlState } from "@/hooks/use-table-url-state";
import { rankItem, type RankingInfo } from "@tanstack/match-sorter-utils";
import { getRouteApi } from "@tanstack/react-router";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type FilterFn,
  type VisibilityState,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Columns as columns } from "./columns";
import { Vendor } from "./schema";
import React from "react";
import { DataTablePagination } from "./pagination";
const route = getRouteApi("/requestor/vendors/");

type DataTableProps = {
  data: Vendor[];
};
declare module "@tanstack/react-table" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};
export function DataTable({ data }: DataTableProps) {
  const isBrowser = typeof window !== "undefined";

  // Helpers
  const allowedColumnIds = React.useMemo(() => {
    return new Set(
      columns
        .map((c) => (c as any).id ?? (c as any).accessorKey)
        .filter(Boolean)
    );
  }, [columns]);
  // Local UI-only states
  const defaultVisibility: VisibilityState = {};

  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(() => {
      if (!isBrowser) return defaultVisibility;
      try {
        const raw = window.localStorage.getItem(`data-table:columnVisibility`);
        if (!raw) return defaultVisibility;
        const parsed = JSON.parse(raw) as VisibilityState;
        return Object.fromEntries(
          Object.entries(parsed).filter(([key]) => allowedColumnIds.has(key))
        ) as VisibilityState;
      } catch {
        return defaultVisibility;
      }
    });

  const persistVisibility = React.useCallback(
    (next: VisibilityState) => {
      if (!isBrowser) return;
      try {
        window.localStorage.setItem(
          `data-table:columnVisibility`,
          JSON.stringify(next)
        );
      } catch {
        /* ignore */
      }
    },
    [isBrowser]
  );

  // Local state management for table (uncomment to use local-only state, not synced with URL)
  // const [globalFilter, onGlobalFilterChange] = useState('')
  // const [columnFilters, onColumnFiltersChange] = useState<ColumnFiltersState>([])
  // const [pagination, onPaginationChange] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })

  // Synced with URL states (updated to match route search schema defaults)
  const {
    globalFilter,
    onGlobalFilterChange,
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search: route.useSearch(),
    navigate: route.useNavigate(),
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: true, key: "filter" },
    columnFilters: [
      { columnId: "status", searchKey: "status", type: "array" },
      { columnId: "priority", searchKey: "priority", type: "array" },
    ],
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
      pagination,
    },
    autoResetPageIndex: false,
    manualPagination: true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: (updater) => {
      setColumnVisibility((prev) => {
        const next =
          typeof updater === "function"
            ? (updater as (old: VisibilityState) => VisibilityState)(prev)
            : updater;
        persistVisibility(next);
        return next;
      });
    },
    globalFilterFn: (row, _columnId, filterValue) => {
      const id = String(row.getValue("id")).toLowerCase();
      const supplierName = String(row.getValue("supplier_name")).toLowerCase();
      const searchValue = String(filterValue).toLowerCase();
      return id.includes(searchValue) || supplierName.includes(searchValue);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onPaginationChange,
    onGlobalFilterChange,
    onColumnFiltersChange,
    filterFns: {
      fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
    },
  });

  const pageCount = table.getPageCount();
  useEffect(() => {
    ensurePageInRange(pageCount);
  }, [pageCount, ensurePageInRange]);

  return (
    <div className="space-y-4 max-sm:has-[div[role='toolbar']]:mb-16 ">
      <DataTableToolbar table={table} searchPlaceholder="Search..." />

      {/* change: make wrapper `relative overflow-auto` so sticky columns work */}
      <div className="relative overflow-auto rounded-md border">
        <Table>
          <TableHeader className="text-red-500">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  // detect the actions column by id
                  const isActionsCol = header.column.id === "actions";

                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      // apply sticky styles when actions column
                      className={
                        isActionsCol
                          ? "sticky right-0 z-30  backdrop-blur-xl border-l "
                          : undefined
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-bottom"
                >
                  {row.getVisibleCells().map((cell) => {
                    const isActionsCell = cell.column.id === "actions";
                    return (
                      <TableCell
                        key={cell.id}
                        className={
                          isActionsCell
                            ? "sticky right-0 z-30 after:bg-background/20 after:absolute after:inset-0 after:-z-10 after:backdrop-blur-lg"
                            : undefined
                        }
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center "
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} url={"/requestor/vendors/"} />
    </div>
  );
}
