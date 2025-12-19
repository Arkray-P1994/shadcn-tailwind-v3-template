// import { useUser } from "@/api/fetch-user";
import { useFetchUser } from "@/api/fetch-user";
import { useRouter } from "@tanstack/react-router";
import React, { createContext, useContext, useEffect, useMemo } from "react";
// import DataTableSkeleton from "../skeleton/data-table-skeleton";

/** ---------- Types ---------- */
export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

/** Possible shapes your hook or API might return */
type UserLike = Partial<User> & {
  username?: string;
  email?: string;
  id?: string;
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

  // If your backend doesn’t guarantee id/email yet, you can decide to reject or coerce.
  // Here we coerce with sensible fallbacks so the app can still run.
  const id = candidate.id ?? "unknown";
  const username = candidate.username ?? "";
  const email = candidate.email ?? "";

  // If you prefer strictness, replace with a guard:
  // if (!candidate.id || !candidate.email || !candidate.username) return null;

  return { id, username, email };
}

function normalizeUser(raw: RawUser): {
  user: User | null;
  err: string | null;
} {
  if (!raw) return { user: null, err: null };

  if (typeof raw === "object" && "status" in raw) {
    // Handle success (nested or flat)
    if (raw.status === "success") {
      const candidate =
        (raw as RawSuccessNested).user ?? (raw as RawSuccessFlat);
      return { user: toUser(candidate), err: null };
    }
    // Handle error shape
    if (raw.status === "error") {
      return { user: null, err: (raw as RawError).message ?? null };
    }
  }

  // Plain user object already
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

export function RequireAuth({
  children,
  loading = (
    <div className="p-4">
      {/* <DataTableSkeleton /> */}
      <p>loading</p>
    </div>
  ),
}: {
  children: React.ReactNode;
  loading?: React.ReactNode;
}) {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.navigate({ to: "/login/requestor" });
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return <>{loading}</>;
  if (!isAuthenticated) return null;
  return <>{children}</>;
}
