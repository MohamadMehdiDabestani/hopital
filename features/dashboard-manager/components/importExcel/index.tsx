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
import { FilterControls } from "./filterControls";
import { UsersTable } from "./usersTable";
import {
  useExcelParser,
  useNotificationStore,
  useRowFilters,
} from "@/features/core";
import { useRouter } from "next/navigation";
import { useImportUsers } from "../../hooks/useImportExcel";
import {
  ImportExcelHeaderMap,
  PersianRoleMapper,
} from "@/features/dashboard-manager/const";
import { excelRowImportSchema } from "../../schemas/dashboard-managerImportExcel.schema";
export const UsersImportExcel = () => {
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
    transformRow: (row) => ({
      ...row,
      role: PersianRoleMapper[row.role] || row.role,
      suspended: (() => {
        const val = String(row.suspended || "").replace(/\s+/g, "");
        if (val === "فعال") return false;
        if (val === "غیرفعال") return true;
        return row.suspended;
      })(),
      phoneNumber: String(row.phoneNumber),
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
    pinRow
  } = useRowFilters(parsedData);

  const { importing, error: importError, importRows } = useImportUsers();
  const { show } = useNotificationStore();
  const router = useRouter();
  const handleImport = async () => {
    const result = await importRows(parsedData);
    if (result.success) {
      show("کاربران با موفقیت اضافه شده اند", "success");
      router.push("/dashboard/manager");
    }
  };
const handleEditCell = (rowId: string, field: string, value: any) => {
  if (showOnlyErrors) pinRow(rowId);  // قبل از ویرایش pin کن
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

          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            {parsedData.length} ردیف خوانده شد (
            {parsedData.filter((r) => r.isValid).length} معتبر)
          </Typography>

          <UsersTable
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
