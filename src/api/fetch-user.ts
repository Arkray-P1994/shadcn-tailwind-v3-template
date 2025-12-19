import { baseUrl } from "@/lib/base-url";
import useSWR from "swr";
const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
};

const fetcher = async (url: string, payload?: any) => {
  const token = getCookie("bearer_token");
  const isFormData = payload instanceof FormData;

  // Decode the token if it exists
  const decodedToken = token ? decodeURIComponent(token) : null;

  const options: RequestInit = {
    method: payload ? "POST" : "GET",
    credentials: "include",
    headers: {
      accept: "application/json",
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(decodedToken ? { Authorization: `Bearer ${decodedToken}` } : {}),
    },
    ...(payload && {
      body: isFormData ? payload : JSON.stringify(payload),
    }),
  };

  // ... rest of your code

  const res = await fetch(url, options);

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    /* ignore */
  }

  if (!res.ok) {
    const msg = data?.error || data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
};

export function useFetchUser() {
  // Build query params dynamically
  const url = `${baseUrl}/api/user`;

  const { data, error, isLoading } = useSWR(url, fetcher);

  return {
    user: data ?? [],
    error,
    isLoading,
  };
}
