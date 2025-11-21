import { useQueryState } from "nuqs";
import { useLedger } from "./fetch-ledger";

export function useLedgerData(search: { filter?: string }) {
  // Pull params from URL/query state
  const filter = search.filter ?? "";

  const [page] = useQueryState("page", { defaultValue: "1" });
  const [limit] = useQueryState("pageSize", { defaultValue: "10" });
  const [sort] = useQueryState("sort", { defaultValue: "" });

  // Call your data hook
  const { data, isLoading } = useLedger({
    page: String(page),
    limit: String(limit),
    filter: String(filter),
    sort: String(sort),
  });

  // Return the data and any extras you might need
  return { data, isLoading };
}
