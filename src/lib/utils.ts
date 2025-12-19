import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export const moqSchema = z.object({
  moq: z.number().min(0, { message: "MOQ must be greater than 0" }),
  unit_id: z.number().min(1, { message: "Unit is required" }),
  remarks: z.string().nullable().optional(),
});

export const itemSchema = z.object({
  name: z.string().min(1, { message: "Item name is required" }),
  code: z.string().optional(),
  moq: z
    .array(moqSchema)
    .min(1, { message: "At least 1 MOQ entry is required" }),
});

export const requestFormSchema = z.object({
  id: z.string().optional(),

  requestor_id: z.number().min(1, { message: "Requestor is required" }),
  purchaser: z.string().min(1, { message: "Purchaser is required" }),
  project: z.string().min(1, { message: "Project is required" }),
  purpose: z.string().min(1, { message: "Purpose is required" }),
  deadline: z.date().min(1, { message: "Deadline is required" }),
  name_1: z.string().nullable().optional(),
  name_2: z.string().nullable().optional(),
  address_1: z.string().nullable().optional(),
  requestor: z.array(z.instanceof(File)).optional(),
  items: z.array(itemSchema).min(1, { message: "At least 1 item is required" }),
  vendor_id: z
    .array(z.number())
    .min(1, { message: "Please select atleast 1 vendor" }),
});

export type RequestFormValues = z.infer<typeof requestFormSchema>;

const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
};

export const fetcher = async (url: string, payload?: any) => {
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

//

export const purchasingFormSchecma = z.object({
  id: z.string().optional(),
  pic: z.string().min(1, { message: "PIC is required" }),
  item_code: z.string().optional(),
  old_ver: z.string().optional(),
  compatibility: z.string().optional(),
  draw_change_no: z.string().optional(),
  draw_file: z.array(z.instanceof(File).optional()),
});

export type PurchasingFormValues = z.infer<typeof purchasingFormSchecma>;

export function formatDateForSubmission(date: Date): string {
  const manilaOffsetMs = 8 * 60 * 60 * 1000; // UTC+8
  const manilaTime = new Date(date.getTime() + manilaOffsetMs);

  const year = manilaTime.getUTCFullYear();
  const month = String(manilaTime.getUTCMonth() + 1).padStart(2, "0");
  const day = String(manilaTime.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatItemCodes(itemCodes: string): string {
  return itemCodes
    .split(/\s+/)
    .filter((code) => code.trim() !== "")
    .join(",");
}

export function appendFilesToFormData(
  formData: FormData,
  value?: File | File[] | FileList | null
) {
  if (!value) return;

  const files = Array.isArray(value)
    ? value
    : value instanceof FileList
      ? Array.from(value)
      : [value];

  files.forEach((file) => {
    formData.append(`attachments`, file, file.name);
  });
}

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "credit":
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800";
    case "debit":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800";
  }
};

export const canPreview = (filename: string) => {
  const extension = filename.toLowerCase().split(".").pop();
  return ["pdf", "jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(
    extension || ""
  );
};

export const topNav = [
  {
    title: "Dashboard",
    href: "/logistics/purchasing/dashboard",
    isActive: true,
    disabled: false,
  },
  {
    title: "Purchasing",
    href: "/logistics/purchasing/purchasing-page",
    isActive: false,
  },
  {
    title: "Miro",
    href: "/logistics/purchasing/miro",
    isActive: false,
  },
  {
    title: "Vendor",
    href: "/logistics/purchasing/vendor",
    isActive: false,
  },
  {
    title: "Ledger",
    href: "/logistics/purchasing/ledger",
    isActive: false,
  },
];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generates page numbers for pagination with ellipsis
 * @param currentPage - Current page number (1-based)
 * @param totalPages - Total number of pages
 * @returns Array of page numbers and ellipsis strings
 *
 * Examples:
 * - Small dataset (≤5 pages): [1, 2, 3, 4, 5]
 * - Near beginning: [1, 2, 3, 4, '...', 10]
 * - In middle: [1, '...', 4, 5, 6, '...', 10]
 * - Near end: [1, '...', 7, 8, 9, 10]
 */
export function getPageNumbers(currentPage: number, totalPages: number) {
  const maxVisiblePages = 5; // Maximum number of page buttons to show
  const rangeWithDots = [];

  if (totalPages <= maxVisiblePages) {
    // If total pages is 5 or less, show all pages
    for (let i = 1; i <= totalPages; i++) {
      rangeWithDots.push(i);
    }
  } else {
    // Always show first page
    rangeWithDots.push(1);

    if (currentPage <= 3) {
      // Near the beginning: [1] [2] [3] [4] ... [10]
      for (let i = 2; i <= 4; i++) {
        rangeWithDots.push(i);
      }
      rangeWithDots.push("...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      // Near the end: [1] ... [7] [8] [9] [10]
      rangeWithDots.push("...");
      for (let i = totalPages - 3; i <= totalPages; i++) {
        rangeWithDots.push(i);
      }
    } else {
      // In the middle: [1] ... [4] [5] [6] ... [10]
      rangeWithDots.push("...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        rangeWithDots.push(i);
      }
      rangeWithDots.push("...", totalPages);
    }
  }

  return rangeWithDots;
}

// new
export function getStatusStyles(status: string) {
  switch (status.toLowerCase()) {
    case "submitted":
      return "bg-green-500/20 text-green-800 border-green-500/30";
    case "declined":
      return "bg-destructive/20 text-red-800 border-destructive/30";
    case "waiting for supplier":
      return "bg-amber-500/20 text-amber-800 border-amber-500/30";
    default:
      return "";
  }
}
