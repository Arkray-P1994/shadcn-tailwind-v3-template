"use client";

import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
export type FormActionsProps = {
  action: "create" | "update";
  isLoading: boolean;
  isDirty?: boolean;
  onCancel: () => void;
};
export function FormActions({
  action,
  isLoading,
  isDirty = true,
  onCancel,
}: FormActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-end items-center">
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="px-8 h-12 hover:bg-slate-50 bg-transparent"
          disabled={isLoading || !isDirty}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="lg"
          disabled={isLoading || !isDirty}
          className="px-8 h-12 font-semibold mb-4"
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin " />
              {action === "create"
                ? "Creating Request..."
                : "Updating Request..."}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {action === "create" ? (
                <>
                  <Plus className="w-4 h-4" />
                  Create Request
                </>
              ) : (
                <>
                  <Pencil className="w-4 h-4" />
                  Update Request
                </>
              )}
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}
