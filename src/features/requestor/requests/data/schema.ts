import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const ledgerSchema = z.object({
  id: z.number(),
  supplier_name: z.string(),
  date: z.string(),
  type: z.string(),
  attachments: z.array(z.string()),
});

export type Ledger = z.infer<typeof ledgerSchema>;

export const ledgerFormSchema = z.object({
  id: z.number().int().optional().nullable(),
  attachments: z.array(z.instanceof(File)),
});

export type VendorFormValues = z.infer<typeof ledgerFormSchema>;

export const updateledgerFormSchema = z.object({
  id: z.string().optional(),
  supplier_name: z.string().min(1, { message: "Supplier is required" }),
  type: z.string().min(1, { message: "Supplier is required" }),
  document_number: z.string().min(1, { message: "Supplier is required" }),
  date: z.date(),
});

export type LedgerFormValues = z.infer<typeof updateledgerFormSchema>;
