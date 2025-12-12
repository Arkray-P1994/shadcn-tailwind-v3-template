import { VendorPage } from "@/features/requestor/vendors";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/requestor/vendors/")({
  component: VendorPage,
});
