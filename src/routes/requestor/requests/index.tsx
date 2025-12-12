import { RequestsPage } from "@/features/requestor/requests";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/requestor/requests/")({
  component: RequestsPage,
});
