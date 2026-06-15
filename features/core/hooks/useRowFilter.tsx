"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ImportExcelParsedRow } from "../type";
import levenshtein from "fast-levenshtein";
import useSWR from "swr";
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

  return {
    name,
    doseValue,
    doseUnit,
  };
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
  // IF YOU WANT TO USE OPENAI API CHECKOUT /api/medicine/spellcheck BUT BECAUSE OF COSTS AND API INDEPENDENCE I PREFRE TO USE THIS METHOD
  const calculateWrongNames = useCallback(() => {
    if (!dbMedicines.length) {
      setWrongNames([]);
      return;
    }

    const result: WrongNameItem[] = [];

    for (const row of rows) {
      const inputRaw = row?.data?.name || "";
      const { name: parsedName } = parseMedicine(inputRaw);
      const inputName = normalizePersian(parsedName);

      if (!inputName) continue;
      if (dbMedicines.includes(inputName)) continue;

      let bestMatch: string | null = null;
      let bestDistance = Infinity;

      const compactInput = inputName.replace(/\s/g, "");

      for (const med of dbMedicines) {
        const dist = levenshtein.get(compactInput, med.replace(/\s/g, ""));
        if (dist < bestDistance) {
          bestDistance = dist;
          bestMatch = med;
        }
      }

      if (bestDistance <= 3 && bestMatch) {
        result.push({
          rowId: row.id,
          input: inputRaw,
          suggestion: bestMatch,
        });
      }
    }
    setWrongNames(result);
    setShowOnlyWrongNames(true);
  }, [rows, dbMedicines]);
  const runWrongNamesCheck = useCallback(() => {
    if (!shouldFetchWrongNames) {
      autoRunAfterFetchRef.current = true;
      setShouldFetchWrongNames(true);
      return;
    }

    if (medicinesLoading) return;

    calculateWrongNames();
    setShowOnlyWrongNames(true);
  }, [shouldFetchWrongNames, medicinesLoading, calculateWrongNames]);

  useEffect(() => {
    if (!autoRunAfterFetchRef.current) return;
    if (!shouldFetchWrongNames) return;
    if (medicinesLoading) return;
    if (medicinesError) return;

    autoRunAfterFetchRef.current = false;
    calculateWrongNames();
    setShowOnlyWrongNames(true);
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
    medicinesLoading,
    setShowOnlyWrongNames,
    showOnlyWrongNames,
  };
};
