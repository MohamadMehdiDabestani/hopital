"use client";

import {
  Box,
  Typography,
  Alert,
  Button,
  CircularProgress,
} from "@mui/material";
import { FileUploader } from "./fileUpload";
import { FilterControls } from "./filterControls";
import { MedicineTable } from "./medicineTable";
import { useExcelParser } from "@/features/dashboard-medicine/hooks/useExcelParser";
import { useRowFilters } from "@/features/dashboard-medicine/hooks/useRowFilter";
import { useImportMedicines } from "@/features/dashboard-medicine/hooks/useImportExcel";
import { useNotificationStore } from "@/features/core";
import { useRouter } from "next/navigation";

export const MedicineImportExcel = () => {
  const {
    parsedData,
    loading,
    error: parseError,
    parseFile,
    updateRow,
    toggleRowSelection,
    toggleSelectAll,
  } = useExcelParser();

  const {
    filteredRows,
    showOnlyEmpty,
    showOnlyErrors,
    setShowOnlyEmpty,
    setShowOnlyErrors,
  } = useRowFilters(parsedData);

  const { importing, error: importError, importRows } = useImportMedicines();
  const {show} = useNotificationStore()
  const router = useRouter()
  const handleImport = async () => {
    const result = await importRows(parsedData);
    if (result.success) {
      show("دارو ها با موفقیت اضافه شدند" , "success")
      router.push("/dashboard/medicine")
    }
  };

  const selectedValidCount = parsedData.filter(
    (r) => r.selected && r.isValid,
  ).length;

  const allSelected = parsedData.every((row) => row.selected);

  return (
    <Box sx={{ p: 3 }}>
      <FileUploader loading={loading} onFileSelect={parseFile} />

      {(parseError || importError) && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {parseError || importError}
        </Alert>
      )}

      {parsedData.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <FilterControls
            showOnlyEmpty={showOnlyEmpty}
            showOnlyErrors={showOnlyErrors}
            onToggleEmpty={setShowOnlyEmpty}
            onToggleErrors={setShowOnlyErrors}
          />

          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            {parsedData.length} ردیف خوانده شد (
            {parsedData.filter((r) => r.isValid).length} معتبر)
          </Typography>

          <MedicineTable
            rows={filteredRows}
            allSelected={allSelected}
            onSelectAll={toggleSelectAll}
            onSelectRow={toggleRowSelection}
            onEditCell={updateRow}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleImport}
            disabled={importing || selectedValidCount === 0}
            sx={{ mt: 2 }}
          >
            {importing ? (
              <CircularProgress size={24} />
            ) : (
              `ایمپورت ${selectedValidCount} ردیف`
            )}
          </Button>
        </Box>
      )}
    </Box>
  );
};
