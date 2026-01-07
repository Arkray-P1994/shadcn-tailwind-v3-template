import { RequestsPage } from "@/features/vendor/requests";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/vendor/requests/")({
  component: RequestsPage,
});
