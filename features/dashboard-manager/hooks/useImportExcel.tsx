import { useState } from "react";
import { ImportExcelParsedRow } from "@/features/dashboard-medicine/type";

export const useImportUsers = () => {
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const importRows = async (
    rows: ImportExcelParsedRow[],
    codeMeliPass: boolean,
  ) => {
    const selectedRows = rows.filter((row) => row.selected && row.isValid);

    if (selectedRows.length === 0) {
      setError("هیچ ردیف معتبری انتخاب نشده است");
      return { success: false };
    }

    setImporting(true);
    setError(null);

    try {
      const response = await fetch("/api/dashboard/manager/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rows: selectedRows.map((row) => row.data),
          codeMeliPass,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "خطا در ایمپورت داده‌ها");
      }

      const result = await response.json();
      return { success: true, imported: result.imported };
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ایمپورت");
      return { success: false };
    } finally {
      setImporting(false);
    }
  };

  return {
    importing,
    error,
    importRows,
  };
};
