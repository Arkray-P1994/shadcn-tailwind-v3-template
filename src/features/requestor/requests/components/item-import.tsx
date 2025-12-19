import Papa from "papaparse";
import * as XLSX from "xlsx";

// Define the Unit type
type Unit = {
  id: number;
  name: string;
};

// --- Helper: handle CSV/XLSX import ---
export function handleFileImport(
  file: File,
  appendItem: any,
  units: Unit[] // Add units as a parameter
) {
  const reader = new FileReader();

  reader.onload = (e) => {
    const data = e.target?.result;
    if (!data) return;

    let rows: any[] = [];

    // CSV
    if (file.name.endsWith(".csv")) {
      const csvData = Papa.parse(data.toString(), { header: true });
      rows = csvData.data;
    }
    // Excel
    else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      const workbook = XLSX.read(data, { type: "binary" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      rows = XLSX.utils.sheet_to_json(firstSheet);
    }

    // Group by item_name + item_code
    const groupedItems: Record<string, any> = {};
    rows.forEach((row: any) => {
      const key = `${row.item_name || ""}-${row.item_code || ""}`;
      if (!groupedItems[key]) {
        groupedItems[key] = {
          name: row.item_name || "",
          code: row.item_code || "",
          moq: [],
        };
      }
      if (row.moq) {
        groupedItems[key].moq.push({
          moq: Number(row.moq) || 0,
          unit_id: units.find((u: Unit) => u.name === row.unit)?.id || 1,
          remarks: row.remarks || "",
        });
      }
    });

    // Append items to form
    Object.values(groupedItems).forEach((item) => appendItem(item));
  };

  if (file.name.endsWith(".csv")) reader.readAsText(file);
  else reader.readAsBinaryString(file);
}
