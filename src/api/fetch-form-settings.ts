import { baseUrl } from "@/lib/base-url";
import { fetcher } from "@/lib/utils";
import useSWR from "swr";

export function useFetchFormSettings() {
  const { data, error, isLoading } = useSWR(
    `${baseUrl}/api/requestors/quotations/create/formdata/`,
    fetcher
  );

  return {
    data: data ?? [],
    error,
    isLoading,
  };
}
