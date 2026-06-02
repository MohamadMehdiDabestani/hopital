"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { ExcelParserOptions, ParsedRow } from "../type";

interface UseExcelParserReturn<T> {
  parsedData: ParsedRow<T>[];
  loading: boolean;
  error: string | null;
  parseFile: (file: File) => Promise<void>;
  updateRow: (rowId: string, field: string, value: unknown) => void;
  toggleRowSelection: (rowId: string) => void;
  toggleSelectAll: () => void;
  setError: (error: string | null) => void;
  selectedCount: number;
  validCount: number;
}

export function useExcelParser<T = Record<string, unknown>>({
  headerMap,
  schema,
  transformRow,
}: ExcelParserOptions<T>): UseExcelParserReturn<T> {
  const [parsedData, setParsedData] = useState<ParsedRow<T>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);
  // ── Validation ──────────────────────────────────────────────────────────

  const validateRow = useCallback(
    (
      rawData: Record<string, unknown>,
    ): Omit<ParsedRow<T>, "id" | "selected"> => {
      const transformed = transformRow
        ? transformRow(rawData)
        : (rawData as Record<string, T>);
      const result = schema.safeParse(transformed);

      if (result.success) {
        return { data: result.data, isValid: true, validationError: "" };
      }

      return {
        data: transformed as T,
        isValid: false,
        validationError: result.error.issues
          .map((issue) => issue.message)
          .join(" | "),
      };
    },
    [schema, transformRow],
  );

  // ── Excel Parsing ───────────────────────────────────────────────────────
  const parseFile = useCallback(
    async (file: File) => {
      setLoading(true);
      setError(null);
      setParsedData([]);

      // terminate worker قبلی اگه هنوز داره کار می‌کنه
      workerRef.current?.terminate();

      const buffer = await file.arrayBuffer();

      await new Promise<void>((resolve) => {
        const worker = new Worker(
          new URL("../worker/excelParser.worker.ts", import.meta.url),
          { type: "module" },
        );
        workerRef.current = worker;

        worker.onmessage = (e: MessageEvent) => {
          const result = e.data;

          if (!result.success) {
            setError(result.error);
            worker.terminate();
            workerRef.current = null;
            setLoading(false);
            resolve();
            return;
          }

          const allRows: ParsedRow<T>[] = result.rows.map(
            ({
              id,
              rawData,
            }: {
              id: string;
              rawData: Record<string, unknown>;
            }) => {
              const validation = validateRow(rawData);
              return { id, selected: validation.isValid, ...validation };
            },
          );

          worker.terminate();
          workerRef.current = null;

          // ── Chunked Rendering ──────────────────────────────────────────────
          const CHUNK_SIZE = 100;
          let index = 0;

          const addChunk = () => {
            const end = Math.min(index + CHUNK_SIZE, allRows.length);
            setParsedData(allRows.slice(0, end));
            index = end;
            if (index < allRows.length) {
              requestAnimationFrame(addChunk);
            } else {
              setLoading(false);
              resolve();
            }
          };

          addChunk();
        };

        worker.onerror = (err) => {
          console.error("❌ Worker error:", err);
          setError("خطا در پردازش فایل");
          worker.terminate();
          workerRef.current = null;
          setLoading(false);
          resolve();
        };

        // buffer رو با transfer منتقل می‌کنیم تا کپی نشه (zero-copy)
        worker.postMessage({ buffer, headerMap }, [buffer]);
      });
    },
    [headerMap, validateRow],
  );

  // ── Row Updates ─────────────────────────────────────────────────────────

  const updateRow = useCallback(
    (rowId: string, field: string, value: unknown) => {
      setParsedData((prev) =>
        prev.map((row) => {
          if (row.id !== rowId) return row;

          const mergedData = { ...row.data, [field]: value };
          const validation = validateRow(mergedData);

          return {
            ...row,
            selected: validation.isValid,
            ...validation,
          };
        }),
      );
    },
    [validateRow],
  );

  // ── Selection Helpers ───────────────────────────────────────────────────

  const toggleRowSelection = useCallback((rowId: string) => {
    setParsedData((prev) =>
      prev.map((row) => {
        if (row.id !== rowId) return row;
        if (!row.isValid) return { ...row, selected: false };
        return { ...row, selected: !row.selected };
      }),
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    setParsedData((prev) => {
      const validRows = prev.filter((row) => row.isValid);
      const allValidSelected =
        validRows.length > 0 && validRows.every((row) => row.selected);

      return prev.map((row) => {
        if (!row.isValid) return { ...row, selected: false };
        return { ...row, selected: !allValidSelected };
      });
    });
  }, []);

  // ── Derived State ───────────────────────────────────────────────────────

  const validCount = useMemo(
    () => parsedData.filter((row) => row.isValid).length,
    [parsedData],
  );

  const selectedCount = useMemo(
    () => parsedData.filter((row) => row.selected).length,
    [parsedData],
  );

  // ── Return ──────────────────────────────────────────────────────────────

  return {
    parsedData,
    loading,
    error,
    parseFile,
    updateRow,
    toggleRowSelection,
    toggleSelectAll,
    setError,
    selectedCount,
    validCount,
  };
}
