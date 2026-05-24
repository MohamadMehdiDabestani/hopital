"use client";

import {
  Box,
  Typography,
  Alert,
  Button,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { FileUploader } from "./fileUpload";
import { MedicineTable } from "./medicineTable";
import { useExcelParser , useRowFilters , FilterControls } from "@/features/core";
import { useImportMedicines } from "@/features/dashboard-medicine/hooks/useImportExcel";
import { useNotificationStore } from "@/features/core";
import { useRouter } from "next/navigation";
import {
  ImportExcelHeaderMap,
  persianToEnglishForm,
} from "@/features/dashboard-medicine/const";
import { excelRowImportSchema } from "@/features/dashboard-medicine/schemas/dashbaord-medicineImport.schema";

export const MedicineImportExcel = () => {
  const {
    parsedData,
    loading,
    error: parseError,
    parseFile,
    updateRow,
    toggleRowSelection,
    toggleSelectAll,
  } = useExcelParser({
    headerMap: ImportExcelHeaderMap,
    schema: excelRowImportSchema,
    transformRow: (rowData) => ({
      ...rowData,
      form: persianToEnglishForm[rowData.form] || rowData.form,
      isActive: (() => {
        const val = String(rowData.isActive || "").replace(/\s+/g, "");
        if (val === "فعال") return true;
        if (val === "غیرفعال") return false;
        return rowData.isActive;
      })(),
    }),
  });

  const {
    filteredRows,
    showOnlyEmpty,
    showOnlyErrors,
    setShowOnlyEmpty,
    setShowOnlyErrors,
    showValidUnselected,
    setShowValidUnselected,
    pinRow,
  } = useRowFilters(parsedData);

  const {
    importing,
    error: importError,
    importRows,
    dateTimeTrigger,
    setDateTimeTrigger,
  } = useImportMedicines();
  const { show } = useNotificationStore();
  const router = useRouter();
  const handleImport = async () => {
    const result = await importRows(parsedData);
    if (result.success) {
      show("دارو ها با موفقیت اضافه شدند", "success");
      router.push("/dashboard/medicine");
    }
  };

  const handleEditCell = (rowId: string, field: string, value: any) => {
    if (showOnlyErrors) pinRow(rowId);
    updateRow(rowId, field, value);
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
            onToggleUnselected={setShowValidUnselected}
            showValidUnselected={showValidUnselected}
            showOnlyEmpty={showOnlyEmpty}
            showOnlyErrors={showOnlyErrors}
            onToggleEmpty={setShowOnlyEmpty}
            onToggleErrors={setShowOnlyErrors}
          />
          <ToggleButtonGroup
            value={dateTimeTrigger}
            color="info"
            exclusive
            onChange={(_, value) => {
              if (value !== null) {
                setDateTimeTrigger(value);
              }
            }}
            size="small"
            sx={{ ml: 2 }}
          >
            <ToggleButton value="shamsi">شمسی</ToggleButton>
            <ToggleButton value="miladi">میلادی</ToggleButton>
          </ToggleButtonGroup>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            {parsedData.length} ردیف خوانده شد (
            {parsedData.filter((r) => r.isValid).length} معتبر)
          </Typography>

          <MedicineTable
            rows={filteredRows}
            allSelected={allSelected}
            onSelectAll={toggleSelectAll}
            onSelectRow={toggleRowSelection}
            onEditCell={handleEditCell}
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
