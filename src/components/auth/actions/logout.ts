import { showErrorToast } from "@/components/toast/error-toast";
import { showSuccessToast } from "@/components/toast/success-toast";
import { useRouter } from "@tanstack/react-router";
import useSWRMutation from "swr/mutation";
import { baseUrl } from "@/lib/base-url";
import { fetcher } from "@/lib/utils";
import { User } from "@/types/type";

export const logout = (url: string) => {
  // no payload needed, just call POST
  return fetcher(url, {});
};

export function useLogout({ type }: User) {
  const router = useRouter();

  return useSWRMutation(`${baseUrl}/api/logout/`, logout, {
    onSuccess: () => {
      showSuccessToast("Logged out successfully!");
      if (type === "requestor") {
        router.navigate({ to: "/login/requestor" });
      } else {
        router.navigate({ to: "/login/vendor" });
      }
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to logout";
      showErrorToast(message);
    },
  });
}
