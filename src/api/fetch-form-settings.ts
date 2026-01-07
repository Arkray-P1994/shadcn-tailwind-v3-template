import { baseUrl } from "@/lib/base-url";
import { fetcher } from "@/lib/utils";
import useSWR from "swr";

export function useFetchFormSettings({
  type,
}: {
  type: "requestor" | "vendor";
}) {
  const url =
    type === "vendor"
      ? `${baseUrl}/api/vendors/quotations/create/formdata/`
      : `${baseUrl}/api/requestors/quotations/create/formdata/`;

  const { data, error, isLoading } = useSWR(url, fetcher);

  return {
    data: data ?? [],
    error,
    isLoading,
  };
}
