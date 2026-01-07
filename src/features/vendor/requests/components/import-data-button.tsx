"use client";

import ImportFile from "@/components/import-file";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { baseUrl } from "@/lib/base-url";
import { Download, FolderUp, Info } from "lucide-react";
import * as React from "react";

export function ImportDialog({ handleImportData }: { handleImportData: any }) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  const templateUrl = `${baseUrl}/vendor-api/src/Uploads/Template/Importing Template For Vendors.xlsx`;

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);

    if (!open) {
      requestAnimationFrame(() => triggerRef.current?.blur());
    }
  };

  const handleDownloadTemplate = async () => {
    setIsDownloading(true);
    try {
      // Create a temporary link to download the file
      const link = document.createElement("a");
      link.href = templateUrl;
      link.download = "Importing_Template_For_Vendors.xlsx";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading template:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          size="sm"
          className="cursor-pointer h-8 gap-2 bg-transparent"
        >
          <FolderUp size={16} />
          Import
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2">
            <FolderUp size={20} />
            Import New Item
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Upload an Excel file to import vendor information. Make sure your
            file follows the required template format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Before importing:</strong> Download and use our template
              to ensure your data is formatted correctly.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="secondary"
              onClick={handleDownloadTemplate}
              disabled={isDownloading}
              className="flex-1 gap-2"
            >
              <Download size={16} />
              {isDownloading ? "Downloading..." : "Download Template"}
            </Button>
          </div>

          <div className="border-t pt-4">
            {/* <ImportFile action="create" setDialogOpen={setDialogOpen} /> */}
            <ImportFile onImport={handleImportData} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
