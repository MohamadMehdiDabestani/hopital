import * as XLSX from "xlsx";
import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";

type ExportGridToExcelOptions<T extends GridValidRowModel, E = T> = {
  fileName?: string;
  sheetName?: string;
  columns?: GridColDef<any>[];
  columnFilter?: (col: GridColDef<any>) => boolean;
  transformRows?: (rows: T[]) => E[];
};

export function exportGridToExcel<T extends GridValidRowModel, E extends GridValidRowModel = T>(
  rows: T[],
  columns: GridColDef<E>[],
  options: ExportGridToExcelOptions<T, E> = {}
) {
  const {
    fileName = "export.xlsx",
    sheetName = "Sheet1",
    columns: selectedColumns,
    columnFilter = (c) => c.field !== "actions" && c.field !== "__check__",
    transformRows,
  } = options;

  const exportRows = transformRows ? transformRows(rows) : ((rows as unknown) as E[]);
  const cols = (selectedColumns ?? columns).filter(columnFilter);

  const data = exportRows.map((row) => {
    const obj: Record<string, any> = {};

    for (const col of cols) {
      const header = col.headerName ?? col.field;
      const rawValue = (row as any)[col.field];
      let value: any = rawValue;

      if (col.valueGetter) {
        value = (col.valueGetter as any)(rawValue, row, col, null as any);
      }

      if (col.valueFormatter) {
        value = (col.valueFormatter as any)(value, row, col, null as any);
      }

      obj[header] = value ?? "";
    }

    return obj;
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, fileName);
}
