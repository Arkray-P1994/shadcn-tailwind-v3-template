import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { type ColumnDef } from "@tanstack/react-table";

import { Requests } from "./schema";
import { Badge } from "@/components/ui/badge";
import { getStatusStyles } from "@/lib/utils";
import moment, { MomentInput } from "moment";
import { DataTableRowActions } from "./data-table-row-actions";

export const Columns: ColumnDef<Requests>[] = [
  {
    id: "select",
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "quotation_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quotation Number" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue("quotation_number")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "purchaser",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Purchaser" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue("purchaser")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "purpose",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Purpose" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue("purpose")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "deadline",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Deadline" />
    ),
    cell: ({ row }) => {
      const deadline = row.getValue("deadline") as MomentInput;
      return (
        <div className="flex space-x-2">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {moment(deadline).format("ll")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className="flex space-x-2">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            <Badge
              variant="outline"
              className={`${getStatusStyles(status)} border font-medium`}
            >
              {status}
            </Badge>
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "requestor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Requestor" />
    ),
    accessorFn: (row) => row.requestor?.name,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue("requestor")}
          </span>
        </div>
      );
    },
  },

  // {
  //   accessorKey: "attachments",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Attachments" />
  //   ),

  //   cell: ({ row }) => {
  //     const attachments = row.getValue("attachments") as Array<{
  //       origin_file_name: string;
  //       file_loc: string;
  //     }>;

  //     const rowId = row.id; // unique row identifier for localStorage key
  //     const storageKey = `attachments-expanded-${rowId}`;

  //     // Load initial state from localStorage
  //     const [expanded, setExpanded] = React.useState(() => {
  //       const stored = localStorage.getItem(storageKey);
  //       return stored === "true";
  //     });

  //     const handleToggle = () => {
  //       const newState = !expanded;
  //       setExpanded(newState);
  //       localStorage.setItem(storageKey, String(newState));
  //     };

  //     const visibleAttachments = expanded
  //       ? attachments
  //       : attachments.slice(0, 1);

  //     return (
  //       <ul
  //         className={`flex ${
  //           expanded ? "flex-col items-start" : "items-center"
  //         } gap-1`}
  //       >
  //         {visibleAttachments.map((attachment, idx) => {
  //           const isPDF = attachment.origin_file_name.endsWith(".pdf");

  //           return (
  //             <li key={idx} className="flex items-center gap-1">
  //               {!isPDF ? (
  //                 <Button
  //                   variant="ghost"
  //                   size="sm"
  //                   className="text-blue-600 hover:underline p-0 cursor-pointer"
  //                   onClick={() => window.open(attachment.file_loc, "_blank")}
  //                 >
  //                   {attachment.origin_file_name}
  //                 </Button>
  //               ) : (
  //                 <PdfDialogViewer
  //                   pdfUrl={attachment.file_loc}
  //                   triggerText={attachment.origin_file_name}
  //                   className="w-fit p-0"
  //                 />
  //               )}
  //             </li>
  //           );
  //         })}

  //         {attachments.length > 1 && (
  //           <>
  //             {expanded ? (
  //               <span
  //                 onClick={handleToggle}
  //                 className="cursor-pointer text-sm hover:underline"
  //               >
  //                 Show less
  //               </span>
  //             ) : (
  //               <TooltipComponent content="Expand Files">
  //                 <span
  //                   onClick={handleToggle}
  //                   className="cursor-pointer text-center font-extrabold flex justify-start hover:underline"
  //                 >
  //                   ...
  //                 </span>
  //               </TooltipComponent>
  //             )}
  //           </>
  //         )}
  //       </ul>
  //     );
  //   },
  // },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
