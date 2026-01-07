import { useQuotationID } from "@/api/fetch-quotation-id";
import Spinner from "@/components/loader";
import QuotationRequestSlug from "@/features/requestor/requests/$id";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/vendor/requests/$id")({
  loader: async ({ params }) => {
    const id = +params.id;
    if (!id) {
      throw new Error("Vendor not found");
    }
    return id;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const id = Route.useLoaderData();
  const { data, isLoading } = useQuotationID({ id, type: "vendor" });

  //   if (isLoading) return <VendorDetailSkeleton />;

  //   const vendorObj = Array.isArray(vendor)
  //     ? { ...vendor[0], files: vendor[1] || [] }
  //     : vendor;

  if (isLoading) return <Spinner />;
  return <QuotationRequestSlug data={data.data} />;
}
