"use client";

import { UploadIcon } from "lucide-react";
import { useEffect } from "react";
import * as XLSX from "xlsx";

import { useFileUpload } from "@/hooks/use-file-upload";

// Create some dummy initial files
const initialFiles: any[] = [];

interface ImportFileProps {
  onImport: (data: any[]) => void;
}

export default function ImportFile({ onImport }: ImportFileProps) {
  const maxSize = 10 * 1024 * 1024; // 10MB default

  // We don't really need local state for jsonData anymore if we pass it up immediately,
  // but we'll keep it if you use it for debugging.
  // Removed unused jsonData state

  const [
    { files, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile, // <--- 1. Get the remove function
      getInputProps,
    },
  ] = useFileUpload({
    initialFiles,
    maxSize,
    accept:
      ".xlsx, .xls, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv",
  });

  const file = files[0];

  useEffect(() => {
    if (!file) {
      return;
    }

    const parseFile = async () => {
      try {
        // Check if file.file is actually a File object (has arrayBuffer method)
        const fileData =
          file.file instanceof File ? await file.file.arrayBuffer() : null;

        if (!fileData) {
          console.error("Invalid file object");
          return;
        }

        const workbook = XLSX.read(fileData);
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];

        const rawRows = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        }) as any[][];

        const groupedData = groupDataByItem(rawRows);

        // Pass data to parent
        onImport(groupedData);
      } catch (error) {
        console.error("Error parsing file:", error);
      } finally {
        // <--- 2. IMPORTANT: Clear the file immediately after processing
        // This ensures the user can click to upload again, whether it succeeded or failed.
        removeFile(file.id);
      }
    };

    parseFile();
  }, [file, removeFile, onImport]); // Added dependencies for safety

  const groupDataByItem = (rows: any[][]) => {
    const map = new Map();

    rows.forEach((row, index) => {
      // 1. Skip empty rows
      if (row.length === 0) return;

      // 2. Header Detection
      if (index === 0) {
        const col0 = String(row[0] || "")
          .trim()
          .toLowerCase();
        const col2 = row[2];

        const hasHeaderKeywords = [
          "item",
          "name",
          "product",
          "code",
          "description",
          "sku",
        ].some((keyword) => col0.includes(keyword));

        const isQtyColumnText =
          col2 !== undefined && col2 !== null && isNaN(Number(col2));

        if (hasHeaderKeywords || isQtyColumnText) {
          return;
        }
      }

      // 3. Map Columns
      const itemName = row[0];
      const itemCode = row[1] || "";
      const quantity = row[2];
      const unit = row[3] || "pieces";
      const description = row[4] || "";

      if (!itemName) return;

      if (!map.has(itemName)) {
        map.set(itemName, {
          item: itemName,
          code: itemCode,
          moqs: [],
        });
      }

      map.get(itemName).moqs.push({
        quantity: quantity,
        unit: unit,
        description: description,
      });
    });

    return Array.from(map.values());
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex min-h-10 flex-col items-center justify-center rounded-xl border border-input border-dashed p-2 transition-colors hover:bg-accent/50 cursor-pointer"
        onClick={openFileDialog}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input {...getInputProps()} className="sr-only" />

        <div className="flex items-center gap-2 text-muted-foreground">
          <UploadIcon className="size-4" />
          <span className="text-xs font-medium">Import Excel/CSV</span>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="text-destructive text-xs">{errors[0]}</div>
      )}
    </div>
  );
}
