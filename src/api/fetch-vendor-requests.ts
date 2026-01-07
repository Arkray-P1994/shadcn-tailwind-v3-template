import { baseUrl } from "@/lib/base-url";
import { fetcher } from "@/lib/utils";
import useSWR from "swr";

export function useFetchVendorRequests({
  page,
  limit,
  filter,
  sort,
}: { page?: string; limit?: string; filter?: string; sort?: string } = {}) {
  // Build query params dynamically
  const params = new URLSearchParams();

  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (filter) params.append("filter", filter);
  if (sort) params.append("sort", sort);

  const url =
    params.toString().length > 0
      ? `${baseUrl}/api/vendors/quotations?${params.toString()}`
      : `${baseUrl}/api/vendors/quotations`;

  const { data, error, isLoading } = useSWR(url, fetcher, {
    keepPreviousData: true,
  });

  return {
    data: data ?? [],
    error,
    isLoading,
  };
}
