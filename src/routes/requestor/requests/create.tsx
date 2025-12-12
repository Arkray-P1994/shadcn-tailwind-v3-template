import CreateRequest from "@/features/requestor/requests/create";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/requestor/requests/create")({
  component: CreateRequest,
});
