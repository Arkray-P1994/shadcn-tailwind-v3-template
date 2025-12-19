import { baseUrl } from "@/lib/base-url";
import { fetcher } from "@/lib/utils";
import useSWR from "swr";

export function useQuotationID({ id }: { id: number }) {
  const { data, error, isLoading } = useSWR(
    `${baseUrl}/api/requestors/quotations/${id}`,
    fetcher
  );

  return {
    data: data ?? [],
    error,
    isLoading,
  };
}
