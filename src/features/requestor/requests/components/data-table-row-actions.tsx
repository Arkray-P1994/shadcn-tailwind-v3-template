// src/features/ledger/components/data-table-row-actions.tsx

import {
  Tooltip,
  TooltipContent,
  // TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "@tanstack/react-router";
import type { Row } from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
// import { useState } from "react";
// import TooltipComponent from '@/components/tooltip'
// import { LedgerSheet } from './forms/view-ledger'
// import UpdateLedgerForm from './forms/update-ledger-form'
// import UpdateFilesForm from './forms/update-files-form'
// import { DeleteLedger } from '@/components/dialogs/delete-ledger'

interface DataTableRowActionsProps<TData extends { id: string | number }> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends { id: string | number }>({
  row,
}: DataTableRowActionsProps<TData>) {
  // const [openSheet, setOpenSheet] = useState(false);
  // const [openFile, setOpenFile] = useState(false);

  return (
    <div className="flex gap-1">
      {/* <LedgerActionsSheet
        buttonName="asd"
        title="View Ledger Information"
        description="Here you can review the details of the selected ledger."
        buttonType="view"
      >
        <LedgerSheet data={row.original} />
      </LedgerActionsSheet>

      <LedgerActionsSheet
        title="Edit Ledger"
        description="Update the details of the selected ledger."
        buttonType="edit"
        open={openSheet}
        setOpen={setOpenSheet}
      >
        <UpdateLedgerForm
          data={
            row.original as Partial<{
              supplier_name: string
              type: string
              date: Date
            }>
          }
          action="update"
          setOpen={setOpenSheet}
        />
      </LedgerActionsSheet> */}

      <Tooltip>
        <TooltipTrigger asChild></TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Edit File</p>
        </TooltipContent>
      </Tooltip>

      {/* <TooltipComponent content={'Edit File'}>
        <LedgerActionsSheet
          title="Edit Ledger Files"
          description="Update the details of the selected ledger files."
          buttonType="file-edit"
          open={openFile}
          setOpen={setOpenFile}
        >
          <UpdateFilesForm
            data={row.original}
            action={'update'}
            setOpen={setOpenFile}
          />
        </LedgerActionsSheet>
      </TooltipComponent> */}

      {/* <DeleteLedger Id={row.original.id} /> */}
      <Link
        to="/requestor/requests/$id"
        params={{ id: row.original.id.toString() }}
      >
        <ExternalLink className="h-4 w-4  text-blue-500 cursor-pointer" />
      </Link>
    </div>
  );
}
