// hooks/useVendor.ts
"use client";

import { showErrorToast } from "@/components/toast/error-toast";
import { showSuccessToast } from "@/components/toast/success-toast";
import { baseUrl } from "@/lib/base-url";
import { useNavigate } from "@tanstack/react-router";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";

// --- API CONFIG ---
export const API_URL =
  `${baseUrl}/api/vendors/quotations/items/update` as const;

// Generic request wrapper that handles FormData and JSON
const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
};

async function request(url: string, payload?: FormData | object) {
  const isFormData =
    typeof FormData !== "undefined" && payload instanceof FormData;

  const token = getCookie("bearer_token");

  const headers: HeadersInit = {
    accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
  };

  const res = await fetch(url, {
    method: payload ? "POST" : "GET",
    headers,
    body: payload
      ? isFormData
        ? payload
        : JSON.stringify(payload)
      : undefined,
  });

  if (!res.ok) {
    let message = `HTTP error! status: ${res.status}`;
    try {
      const errJson = await res.json();
      message = errJson?.message ?? message;
    } catch {}
    throw new Error(message);
  }

  return (await res.json()) as unknown;
}

// SWR fetcher
const addLedgerFetcher = (url: string, { arg }: { arg: FormData }) =>
  request(url, arg);

// Response shape (best-effort; adapt if backend differs)
export type StoreResponse = {
  success: string;
  attachements?: Array<{
    docuemnt_id: string;
    file_name: string;
    origin_file_name: string;
  }>;
};

export function useEditQuotation({ id }: { id: number }) {
  const navigate = useNavigate();
  return useSWRMutation<unknown, Error, string, FormData>(
    `${API_URL}/${id}`,
    addLedgerFetcher,
    {
      onSuccess: (raw) => {
        const data = raw as Partial<StoreResponse>;
        const msg =
          typeof data?.success === "string" && data.success
            ? data.success
            : "Upload successful";

        const uploadedFilesCount = Array.isArray(data?.attachements)
          ? data.attachements.length
          : 0;

        const extra =
          uploadedFilesCount > 0
            ? ` (uploaded ${uploadedFilesCount} file${uploadedFilesCount > 1 ? "s" : ""})`
            : "";
        showSuccessToast(`${msg}${extra}`);
        mutate(`${baseUrl}/api/vendor/quotations/${id}`);
        navigate({
          to: `/vendor/requests/${id}`,
        });
      },
      onError: (err: any) => {
        showErrorToast(err?.message || "Failed to upload files");
      },
    }
  );
}
