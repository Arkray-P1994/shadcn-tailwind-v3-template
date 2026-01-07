import * as XLSX from "xlsx";

export function exportItemsToXlsx(items: any[]) {
  const blankIfEmpty = (v: any) =>
    v === null || v === undefined || v === "" || Number(v) === 0
      ? ""
      : Number(v);

  const rows = items.flatMap((item) =>
    item.moq.map((m: any) => ({
      "Item Name": item.name ?? "",
      "Item Code": item.code ?? "",
      MOQ: blankIfEmpty(m.moq),

      Unit: m.unit?.name ?? "",

      // 👇 0 / null / undefined → blank
      "Unit Price": blankIfEmpty(m.price),

      Currency: m.currency?.name ?? "",

      // 👇 0 / null / undefined → blank
      "Lead Time (days)": blankIfEmpty(m.leadtime),

      Remarks: m.remarks ?? "",
    }))
  );

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Quotation Items");

  XLSX.writeFile(workbook, "quotation_items.xlsx");
}
