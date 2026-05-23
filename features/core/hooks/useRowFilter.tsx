"use client";
import { useMemo, useState } from "react";
import type { ImportExcelParsedRow } from "../type";

export const useRowFilters = (rows: ImportExcelParsedRow[]) => {
  const [showOnlyEmpty, setShowOnlyEmpty] = useState(false);
  const [showOnlyErrors, setShowOnlyErrors] = useState(false);
  const [showValidUnselected, setShowValidUnselected] = useState(false);
  const [pinnedRowIds, setPinnedRowIds] = useState<Set<string>>(new Set());
  const handleToggleErrors = (val: boolean) => {
    setShowOnlyErrors(val);
    if (!val) setPinnedRowIds(new Set());
  };

  // وقتی row داره ویرایش میشه، pinش کن
  const pinRow = (rowId: string) => {
    setPinnedRowIds((prev) => new Set(prev).add(rowId));
  };
  const filteredRows = useMemo(() => {
    let filtered = rows;

    if (showOnlyEmpty) {
      filtered = filtered.filter((row) => {
        return Object.values(row.data).some(
          (value) => value === null || value === undefined || value === "",
        );
      });
    }

    if (showOnlyErrors) {
      filtered = filtered.filter(
        (row) => row.validationError.length > 0 || pinnedRowIds.has(row.id),
      );
    }
    if (showValidUnselected) {
      filtered = filtered.filter(
        (row) => row.validationError.length == 0 && !row.selected,
      );
    }
    return filtered;
  }, [rows, showOnlyEmpty, showOnlyErrors, showValidUnselected, pinnedRowIds]);

  return {
    filteredRows,
    showOnlyEmpty,
    showOnlyErrors,
    setShowOnlyEmpty,
    setShowOnlyErrors: handleToggleErrors,
    showValidUnselected,
    setShowValidUnselected,
    pinRow,
  };
};
