import LedgerCreateForm from "@/features/requestor/requests/components/forms/create";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/requestor/requests/create")({
  component: LedgerCreateForm,
});
