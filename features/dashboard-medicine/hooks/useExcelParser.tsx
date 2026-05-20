// hooks/useExcelParser.ts
import { useState } from "react";
import * as XLSX from "xlsx";
import { z } from "zod";
import { excelRowImportSchema } from "@/features/dashboard-medicine/schemas/dashboard-medicineAdd.schema";
import { ImportExcelHeaderMap } from "@/features/dashboard-medicine/const";
import type { ImportExcelParsedRow } from "@/features/dashboard-medicine/type";

export const useExcelParser = () => {
  const [parsedData, setParsedData] = useState<ImportExcelParsedRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseFile = async (file: File) => {
    setLoading(true);
    setError(null);
    setParsedData([]);

    try {
      const data = await file.arrayBuffer();

      const workbook = XLSX.read(data);

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
        raw: false,
      });

      if (jsonData.length < 2) {
        throw new Error("فایل اکسل خالی است یا فرمت صحیحی ندارد");
      }

      const headerRow = jsonData[0] as string[];
      const mappedHeaders = headerRow.map(
        (header) => ImportExcelHeaderMap[header?.trim()] || header,
      );

      const dataRows = jsonData.slice(1).filter((row) => {
        return row.some(
          (cell) => cell !== "" && cell !== null && cell !== undefined,
        );
      });

      const rows: ImportExcelParsedRow[] = dataRows.map((row, index) => {
        const rowData: Record<string, any> = {};

        mappedHeaders.forEach((header, i) => {
          if (header) {
            rowData[header] = row[i] ?? "";
          }
        });

        let isValid = true;
        let validationError = "";

        try {
          excelRowImportSchema.parse(rowData);
        } catch (error) {
          isValid = false;
          if (error instanceof z.ZodError) {
            validationError = error.issues.map((e) => e.message).join(" | ");
          }
        }

        return {
          id: `row-${index}`,
          selected: isValid,
          data: rowData,
          validationError,
          isValid,
        };
      });

      setParsedData(rows);
    } catch (err) {
      console.error("❌ Error reading file:", err);
      setError(err instanceof Error ? err.message : "خطا در خواندن فایل");
    } finally {
      setLoading(false);
    }
  };

  const updateRow = (rowId: string, field: string, value: any) => {
    setParsedData((prev) =>
      prev.map((row) => {
        if (row.id === rowId) {
          const newData = { ...row.data, [field]: value };

          let isValid = true;
          let validationError = "";

          try {
            excelRowImportSchema.parse(newData);
          } catch (error) {
            isValid = false;
            if (error instanceof z.ZodError) {
              validationError = error.issues.map((e) => e.message).join(" | ");
            }
          }

          return {
            ...row,
            data: newData,
            isValid,
            validationError,
          };
        }
        return row;
      }),
    );
  };

  const toggleRowSelection = (rowId: string) => {
    setParsedData((prev) =>
      prev.map((row) =>
        row.id === rowId ? { ...row, selected: !row.selected } : row,
      ),
    );
  };

  const toggleSelectAll = () => {
    const allSelected = parsedData.every((row) => row.selected);
    setParsedData((prev) =>
      prev.map((row) => ({ ...row, selected: !allSelected })),
    );
  };

  return {
    parsedData,
    loading,
    error,
    parseFile,
    updateRow,
    toggleRowSelection,
    toggleSelectAll,
    setError,
  };
};
