"use client";

import { useCallback, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid, GridColumnVisibilityModel } from "@mui/x-data-grid";
import { createAdmisionColumns } from "./admisionColumn";
import { useAdmisionHistory } from "../../hooks/useAdmisionHistory";
import { useVisitPrint } from "../../hooks/useVisitPrint";
import { generateVisitPrintHTML } from "../../utils/printHelper";
import { AdmisionHistoryToolbar } from "./admisionToolbar";
import { Dayjs } from "dayjs";
import dayjs from "@/features/core/utils/dayjs";
import { DateTimeTrigger } from "@/features/core";
import { StableToolbar } from "./stableToolbar";

const ALWAYS_HIDDEN_FIELDS = [
  "id",
  "doctorFirstName",
  "doctorLastName",
  "firstName",
  "lastName",
];
const ALWAYS_HIDDEN = Object.fromEntries(
  ALWAYS_HIDDEN_FIELDS.map((field) => [field, false]),
);

export const DashboardAdmisionHistory = ({
  initialData,
}: {
  initialData: any;
}) => {
  const {
    data,
    isLoading,
    paginationModel,
    setPaginationModel,
    filterModel,
    setFilterModel,
    sortModel,
    setSortModel,
    fromDateTime,
    setFromDateTime,
    toDateTime,
    setToDateTime,
  } = useAdmisionHistory({ initialData });
  const [dateTimeTrigger, setDateTimeTrigger] =
    useState<DateTimeTrigger>("shamsi");

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>({
      firstName: false,
      lastName: false,
      ...ALWAYS_HIDDEN,
    });

  const { handlePrint } = useVisitPrint();

  const handlePrintRow = useCallback(
    (row: any) => {
      const html = generateVisitPrintHTML(row, false); // false برای شمسی
      handlePrint(html);
    },
    [dateTimeTrigger, handlePrint],
  );

  const columns = useMemo(
    () => createAdmisionColumns({ dateTimeTrigger, onPrint: handlePrintRow }),
    [handlePrintRow],
  );
  const toolbarProps = useMemo(() => ({
  columns,
  dateTimeTrigger,
  onChangeDateTime: setDateTimeTrigger,
  showQuickFilter: true,
  fromDateTime,
  setFromDateTime,
  toDateTime,
  setToDateTime,
  quickFilterProps: {
    debounceMs: 400,
    slotProps: {
      root: { placeholder: "نام بیمار | نام دکتر | کد ملی " },
    },
  },
  rows: data?.rows ?? [],
  sx: { justifyContent: "flex-start" },
}), [columns, dateTimeTrigger, fromDateTime, toDateTime, data?.rows]);
  return (
    <Box sx={{ height: 750, width: "100%" }}>
      <DataGrid
        rows={data?.rows ?? []}
        columns={columns}
        rowCount={data?.total ?? 0}
        getRowId={(row) => row.id}
        paginationMode="server"
        filterMode="server"
        sortingMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        filterModel={filterModel}
        onFilterModelChange={setFilterModel}
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        pageSizeOptions={[10, 25, 50]}
        disableColumnFilter
        showToolbar
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={(newModel) => {
          setColumnVisibilityModel({ ...newModel, ...ALWAYS_HIDDEN });
        }}
        slotProps={{
          toolbar : toolbarProps,
          columnsManagement: {
            getTogglableColumns: (columns) =>
              columns
                .filter((c) => !ALWAYS_HIDDEN_FIELDS.includes(c.field))
                .map((c) => c.field),
          },
        }}
        slots={{
          toolbar: StableToolbar,
        }}
        loading={isLoading}
      />

      <Typography variant="caption" color="text.secondary">
        برای مشاهده ی جزئیات شارژ ها میتوانید پرینت کنید
      </Typography>
    </Box>
  );
};
