import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { type ColumnDef } from "@tanstack/react-table";

import { DataTableRowActions } from "./data-table-row-actions";
import { Vendor } from "./schema";

export const Columns: ColumnDef<Vendor>[] = [
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
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue("code")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue("name")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue("email")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "products",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Products" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue("products")}
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
