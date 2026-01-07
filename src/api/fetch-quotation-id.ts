import { baseUrl } from "@/lib/base-url";
import { fetcher } from "@/lib/utils";
import useSWR from "swr";
export type User = {
  type: "requestor" | "vendor";
};

export function useQuotationID({
  id,
  type,
}: {
  id: number;
  type: User["type"];
}) {
  const url =
    type === "requestor"
      ? `${baseUrl}/api/requestors/quotations/${id}`
      : `${baseUrl}/api/vendors/quotations/${id}`;

  const { data, error, isLoading } = useSWR(url, fetcher);

  return {
    data: data ?? [],
    error,
    isLoading,
  };
}
