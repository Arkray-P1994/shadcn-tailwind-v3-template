import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const requestSchema = z.object({
  id: z.number(),
  purchaser: z.string(),
  project: z.string(),
  purpose: z.string(),
  deadline: z.string(),
  address: z.string(),
  quotation_number: z.string(),
  status: z.string(),
  requestor: z.object({
    id: z.number(),
    code: z.string(),
    name: z.string(),
    department: z.string(),
  }),
});

export type Requests = z.infer<typeof requestSchema>;
