// import { AuthProvider, RequireAuth } from "@/components/auth/auth";
import VendorId from "@/features/requestor/vendors/$id";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/requestor/vendors/$id")({
  loader: async ({ params }) => {
    const vendorId = +params.id;
    if (!vendorId) {
      throw new Error("Vendor not found");
    }
    return vendorId;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const vendorId = Route.useLoaderData();
  // const { vendor, isLoading } = useVendorId(vendorId);

  // if (isLoading) return <VendorDetailSkeleton />;

  return (
    // <div>
    //   <AuthProvider>
    //     <RequireAuth>
    //       {/* <VendorDetailPage vendor={vendorObj} /> */}
    //       <VendorId id={vendorId} />
    //     </RequireAuth>
    //   </AuthProvider>
    // </div>

    <VendorId id={vendorId} />
  );
}
