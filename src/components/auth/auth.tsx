import { useFetchUser } from "@/api/fetch-user";
import { useRouter } from "@tanstack/react-router";
import React, { createContext, useContext, useEffect, useMemo } from "react";

/** ---------- Types ---------- */
export interface User {
  id: string;
  username: string;
  email: string;
  vendor_type: "requestor" | "vendor";
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

/** * Updated UserLike to include 'ref_type' from your API JSON
 */
type UserLike = Partial<User> & {
  username?: string;
  email?: string | null;
  id?: string | number;
  vendor_type?: string;
  ref_type?: string; // Added to match your API response
};

type RawSuccessNested = { status: "success"; user: UserLike };
type RawSuccessFlat = { status: "success" } & UserLike;
type RawError = { status: "error"; message?: string | null };

type RawUser =
  | User
  | null
  | undefined
  | RawSuccessNested
  | RawSuccessFlat
  | RawError;

/** ---------- Utils ---------- */
function toUser(candidate?: UserLike | null): User | null {
  if (!candidate) return null;

  const id = String(candidate.id ?? "unknown");
  const username = candidate.username ?? "";
  const email = candidate.email ?? "";

  /**
   * FIX: Check for 'ref_type' first (API) then 'vendor_type' (internal)
   */
  const rawRole = candidate.ref_type || candidate.vendor_type;
  const vendor_type = rawRole === "vendor" ? "vendor" : "requestor";

  return { id, username, email, vendor_type };
}

function normalizeUser(raw: RawUser): {
  user: User | null;
  err: string | null;
} {
  if (!raw) return { user: null, err: null };

  if (typeof raw === "object" && "status" in raw) {
    if (raw.status === "success") {
      const candidate =
        (raw as RawSuccessNested).user ?? (raw as RawSuccessFlat);
      return { user: toUser(candidate), err: null };
    }
    if (raw.status === "error") {
      return { user: null, err: (raw as RawError).message ?? null };
    }
  }

  return { user: toUser(raw as UserLike), err: null };
}

function effectiveErrorString(
  normalizedErr: string | null,
  hookErr: unknown
): string | null {
  if (normalizedErr) return normalizedErr;
  if (!hookErr) return null;
  if (typeof hookErr === "string") return hookErr;
  if (typeof hookErr === "object" && hookErr && "message" in hookErr) {
    const m = (hookErr as any).message;
    return typeof m === "string" ? m : JSON.stringify(hookErr);
  }
  try {
    return JSON.stringify(hookErr);
  } catch {
    return String(hookErr);
  }
}

/** ---------- Context ---------- */
const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    user: rawUser,
    isLoading,
    error,
  } = useFetchUser() as {
    user: RawUser;
    isLoading: boolean;
    error?: unknown;
  };

  const value = useMemo<AuthState>(() => {
    const { user, err } = normalizeUser(rawUser);
    const errStr = effectiveErrorString(err, error);

    return {
      isAuthenticated: !!user && !errStr,
      user,
      isLoading: !!isLoading,
      error: errStr,
    };
  }, [rawUser, isLoading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

/** ---------- Role-aware RequireAuth ---------- */
interface RequireAuthProps {
  children: React.ReactNode;
  allowedVendorTypes?: ("requestor" | "vendor")[];
  loading?: React.ReactNode;
}

export function RequireAuth({
  children,
  allowedVendorTypes,
  loading = <p>loading...</p>,
}: RequireAuthProps) {
  const { isLoading, isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // 1. Not logged in -> Go to login
      if (!isAuthenticated) {
        router.navigate({ to: "/login/requestor" });
        return;
      }

      // 2. Logged in but wrong role -> Redirect to their respective dashboard
      if (
        allowedVendorTypes &&
        user &&
        !allowedVendorTypes.includes(user.vendor_type)
      ) {
        const redirectTo =
          user.vendor_type === "vendor" ? "/vendor" : "/requestor";
        router.navigate({ to: redirectTo });
      }
    }
  }, [isLoading, isAuthenticated, user, allowedVendorTypes, router]);

  if (isLoading) return <>{loading}</>;
  if (!isAuthenticated) return null;

  // Final role check before rendering children
  if (
    allowedVendorTypes &&
    user &&
    !allowedVendorTypes.includes(user.vendor_type)
  ) {
    return null;
  }

  return <>{children}</>;
}
