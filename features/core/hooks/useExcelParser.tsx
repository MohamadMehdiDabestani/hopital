"use client";
import { useState } from "react";
import * as XLSX from "xlsx";
import { ExcelParserOptions, ParsedRow } from "../type";

export const useExcelParser = <T = Record<string, any>,>(
  options: ExcelParserOptions<T>,
) => {
  const { headerMap, schema, transformRow } = options;

  const [parsedData, setParsedData] = useState<ParsedRow<T>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateRow = (
    rawData: Record<string, any>,
  ): Pick<ParsedRow<T>, "data" | "isValid" | "validationError"> => {
    const transformed = transformRow ? transformRow(rawData) : rawData;
    const result = schema.safeParse(transformed);

    if (result.success) {
      return { data: result.data, isValid: true, validationError: "" };
    }

    return {
      data: transformed as T,
      isValid: false,
      validationError: result.error.issues.map((e) => e.message).join(" | "),
    };
  };

  // ── Parse File ───────────────────────────────────────────────────────────

  const parseFile = async (file: File) => {
    setLoading(true);
    setError(null);
    setParsedData([]);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, {
        type: "array",
        cellText: false,
        cellDates: true,
        raw: false,
      });
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
      const mappedHeaders = headerRow.map((h) => headerMap[h?.trim()] ?? h);

      const dataRows = jsonData
        .slice(1)
        .filter((row) =>
          row.some(
            (cell) => cell !== "" && cell !== null && cell !== undefined,
          ),
        );

      const rows: ParsedRow<T>[] = dataRows.map((row, index) => {
        const rawData: Record<string, any> = {};
        mappedHeaders.forEach((header, i) => {
          if (header) rawData[header] = row[i] ?? "";
        });

        const { data, isValid, validationError } = validateRow(rawData);

        return {
          id: `row-${index}`,
          selected: isValid,
          data,
          isValid,
          validationError,
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

  // ── Update Row ───────────────────────────────────────────────────────────

  const updateRow = (rowId: string, field: string, value: any) => {
    setParsedData((prev) =>
      prev.map((row) => {
        if (row.id !== rowId) return row;

        const { data, isValid, validationError } = validateRow({
          ...row.data,
          [field]: value,
        });

        return {
          ...row,
          data,
          isValid,
          validationError,
        };
      }),
    );
  };

  // ── Selection Helpers ────────────────────────────────────────────────────
  const toggleRowSelection = (rowId: string) => {
    setParsedData((prev) =>
      prev.map((row) => {
        if (row.id !== rowId) return row;
        if (!row.isValid) return { ...row, selected: false };
        return { ...row, selected: !row.selected };
      }),
    );
  };
  const toggleSelectAll = () => {
    const validRows = parsedData.filter((row) => row.isValid);
    const allValidSelected =
      validRows.length > 0 && validRows.every((row) => row.selected);

    setParsedData((prev) =>
      prev.map((row) => {
        if (!row.isValid) return { ...row, selected: false }; 
        return { ...row, selected: !allValidSelected };
      }),
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
