import { showErrorToast } from "@/components/toast/error-toast";
import { showSuccessToast } from "@/components/toast/success-toast";
import { useRouter } from "@tanstack/react-router";
import useSWRMutation from "swr/mutation";
import { baseUrl } from "@/lib/base-url";
import { fetcher } from "@/lib/utils";

export const logout = (url: string) => {
  // no payload needed, just call POST
  return fetcher(url, {});
};

export function useLogout() {
  const router = useRouter();

  return useSWRMutation(`${baseUrl}/api/logout/`, logout, {
    onSuccess: () => {
      showSuccessToast("Logged out successfully!");
      router.navigate({ to: "/login/requestor" }); // redirect after logout
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to logout";
      showErrorToast(message);
    },
  });
}
