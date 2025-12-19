"use client";

import type { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FileUpload from "../file-upload";

interface FileUploadFieldProps {
  form: UseFormReturn<any>;
  name: "requestor";
  label: string;
}

export function FileUploadField({ form, name, label }: FileUploadFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium">{label}</FormLabel>
          <FormControl>
            <div>
              <FileUpload
                value={field.value ?? []}
                onChange={field.onChange}
                hasError={!!fieldState.error}
                IMPORT={true}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
