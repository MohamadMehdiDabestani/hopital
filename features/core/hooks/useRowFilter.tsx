"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ImportExcelParsedRow } from "../type";
import levenshtein from "fast-levenshtein";
import useSWR from "swr";
import { WorkerPool } from "../utils/workerPool";
import {
  LevenshteinResult,
  LevenshteinTask,
} from "../worker/excelFilter.worker";
let workerPool: WorkerPool | null = null;
function getWorkerPool() {
  if (!workerPool) {
    workerPool = new WorkerPool(
      () =>
        new Worker(new URL("../worker/excelFilter.worker.ts", import.meta.url)),
    );
  }
  return workerPool;
}
const SPELL_METHOD = process.env.NEXT_PUBLIC_SPELL_METHOD as
  | "locale"
  | "openai";
type WrongNameItem = {
  rowId: string;
  input: string;
  suggestion: string;
};

export function parseMedicine(text: string) {
  const normalized = normalizePersian(text);
  const doseRegex = /(\d+(\.\d+)?)\s?(mg|ml|mcg|میلی ?گرم|میلی ?لیتر|گرم)?/i;
  const match = normalized.match(doseRegex);

  let doseValue = null;
  let doseUnit = null;

  if (match) {
    doseValue = parseFloat(match[1]);
    doseUnit = match[3] || null;
  }

  const name = normalized.replace(doseRegex, "").trim();
  return { name, doseValue, doseUnit };
}

export function normalizePersian(text: string) {
  return text
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/‌/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export const useRowFilters = (rows: ImportExcelParsedRow[]) => {
  const [showOnlyEmpty, setShowOnlyEmpty] = useState(false);
  const [showOnlyErrors, setShowOnlyErrors] = useState(false);
  const [showValidUnselected, setShowValidUnselected] = useState(false);
  const [pinnedRowIds, setPinnedRowIds] = useState<Set<string>>(new Set());
  const [shouldFetchWrongNames, setShouldFetchWrongNames] = useState(false);
  const autoRunAfterFetchRef = useRef(false);
  const [showOnlyWrongNames, setShowOnlyWrongNames] = useState(false);
  const [wrongNames, setWrongNames] = useState<WrongNameItem[]>([]);
  const [isCheckingNames, setIsCheckingNames] = useState(false);

  const handleToggleErrors = (val: boolean) => {
    setShowOnlyErrors(val);
    if (!val) setPinnedRowIds(new Set());
  };

  const pinRow = useCallback((rowId: string) => {
    setPinnedRowIds((prev) => {
      const next = new Set(prev);
      next.add(rowId);
      return next;
    });
  }, []);

  const {
    data: dbMedicinesRaw = [],
    isLoading: medicinesLoading,
    error: medicinesError,
  } = useSWR<string[]>(
    shouldFetchWrongNames ? "/api/dashboard/medicine/justNames" : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: Infinity,
    },
  );

  const dbMedicines = useMemo(() => {
    return Array.from(
      new Set(dbMedicinesRaw.map((m) => normalizePersian(m)).filter(Boolean)),
    );
  }, [dbMedicinesRaw]);

  // --- locale method ---
  const calculateWrongNamesLocale = useCallback(async () => {
    if (!dbMedicines || dbMedicines.length === 0) {
      setWrongNames([]);
      return;
    }

    // آماده‌سازی candidates
    const candidates: Array<{
      rowId: string;
      inputRaw: string;
      inputName: string;
      compactInput: string;
    }> = [];

    for (const row of rows) {
      const inputRaw = row?.data?.name || "";
      const parsed = parseMedicine(inputRaw);
      const inputName = normalizePersian(parsed.name);

      if (!inputName || dbMedicines.includes(inputName)) continue;

      candidates.push({
        rowId: row.id,
        inputRaw,
        inputName,
        compactInput: inputName.replace(/\s/g, ""),
      });
    }

    if (candidates.length === 0) {
      setWrongNames([]);
      return;
    }

    // تقسیم به chunk‌ها
    const pool = getWorkerPool();
    const chunkSize = Math.ceil(
      candidates.length / (navigator.hardwareConcurrency || 4),
    );
    const chunks: (typeof candidates)[] = [];

    for (let i = 0; i < candidates.length; i += chunkSize) {
      chunks.push(candidates.slice(i, i + chunkSize));
    }

    // اجرای موازی
    const promises = chunks.map((chunk) =>
      pool.execute<LevenshteinTask, LevenshteinResult[]>({
        candidates: chunk,
        dbMedicines,
      }),
    );

    const results = await Promise.all(promises);
    const merged = results.flat();

    setWrongNames(merged);
    setShowOnlyWrongNames(true);
  }, [rows, dbMedicines]);

  // --- openai method ---
  const calculateWrongNamesOpenAI = useCallback(async () => {
    if (!dbMedicines.length) {
      setWrongNames([]);
      return;
    }

    const candidates: { rowId: string; inputRaw: string; inputName: string }[] =
      [];

    for (const row of rows) {
      const inputRaw = row?.data?.name || "";
      const { name: parsedName } = parseMedicine(inputRaw);
      const inputName = normalizePersian(parsedName);

      if (!inputName) continue;
      if (dbMedicines.includes(inputName)) continue;

      candidates.push({ rowId: row.id, inputRaw, inputName });
    }

    if (!candidates.length) {
      setWrongNames([]);
      return;
    }

    const uniqueNames = [...new Set(candidates.map((c) => c.inputName))];

    setIsCheckingNames(true);
    try {
      const res = await fetch("/api/dashboard/medicine/spellchunk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ names: uniqueNames, dbMedicines }),
      });

      const { results } = (await res.json()) as {
        results: { index: number; suggestion: string | null }[];
      };

      const suggestionMap = new Map<string, string>();
      for (const r of results) {
        if (r.suggestion) {
          const name = uniqueNames[r.index - 1];
          if (name) suggestionMap.set(name, r.suggestion);
        }
      }

      const result: WrongNameItem[] = candidates
        .filter((c) => suggestionMap.has(c.inputName))
        .map((c) => ({
          rowId: c.rowId,
          input: c.inputRaw,
          suggestion: suggestionMap.get(c.inputName)!,
        }));

      setWrongNames(result);
      setShowOnlyWrongNames(true);
    } finally {
      setIsCheckingNames(false);
    }
  }, [rows, dbMedicines]);

  // --- dispatcher ---
  const calculateWrongNames = useCallback(async () => {
    const method = (SPELL_METHOD || "").trim().toLowerCase();
    if (method === "openai") await calculateWrongNamesOpenAI();
    else calculateWrongNamesLocale();
  }, [calculateWrongNamesLocale, calculateWrongNamesOpenAI]);

  const runWrongNamesCheck = useCallback(async () => {
    if (!shouldFetchWrongNames) {
      autoRunAfterFetchRef.current = true;
      setShouldFetchWrongNames(true);
      return;
    }

    if (medicinesLoading) return;

    await calculateWrongNames();
  }, [shouldFetchWrongNames, medicinesLoading, calculateWrongNames]);

  useEffect(() => {
    if (!autoRunAfterFetchRef.current) return;
    if (!shouldFetchWrongNames) return;
    if (medicinesLoading) return;
    if (medicinesError) return;

    autoRunAfterFetchRef.current = false;
    calculateWrongNames();
  }, [
    shouldFetchWrongNames,
    medicinesLoading,
    medicinesError,
    dbMedicinesRaw.length,
  ]);

  const wrongNameRowIds = useMemo(
    () => new Set(wrongNames.map((item) => item.rowId)),
    [wrongNames],
  );

  const filteredRows = useMemo(() => {
    let filtered = rows;

    if (showOnlyEmpty) {
      filtered = filtered.filter((row) =>
        Object.values(row.data).some(
          (value) => value === null || value === undefined || value === "",
        ),
      );
    }

    if (showOnlyErrors) {
      filtered = filtered.filter((r) => !r.isValid || pinnedRowIds.has(r.id));
    }

    if (showValidUnselected) {
      filtered = filtered.filter(
        (row) => row.validationError.length === 0 && !row.selected,
      );
    }

    if (showOnlyWrongNames) {
      filtered = filtered.filter((r) => wrongNameRowIds.has(r.id));
    }

    return filtered;
  }, [
    rows,
    showOnlyEmpty,
    showOnlyErrors,
    showValidUnselected,
    showOnlyWrongNames,
    pinnedRowIds,
    wrongNameRowIds,
  ]);

  return {
    filteredRows,
    showOnlyEmpty,
    showOnlyErrors,
    setShowOnlyEmpty,
    setShowOnlyErrors: handleToggleErrors,
    showValidUnselected,
    setShowValidUnselected,
    pinRow,
    runWrongNamesCheck,
    medicinesLoading: medicinesLoading || isCheckingNames,
    setShowOnlyWrongNames,
    showOnlyWrongNames,
  };
};
