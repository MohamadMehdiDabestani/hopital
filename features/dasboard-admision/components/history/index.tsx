"use client";

import { useCallback, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid, GridColumnVisibilityModel } from "@mui/x-data-grid";
import { DateTimeTrigger } from "@/features/dashboard-medicine/type";
import { createAdmisionColumns } from "./admisionColumn";
import { useAdmisionHistory } from "../../hooks/useAdmisionHistory";
import { useVisitPrint } from "../../hooks/useVisitPrint";
import { generateVisitPrintHTML } from "../../utils/printHelper";
import { AdmisionHistoryToolbar } from "./admisionToolbar";

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
      const html = generateVisitPrintHTML(row, dateTimeTrigger === "miladi");
      handlePrint(html);
    },
    [dateTimeTrigger, handlePrint],
  );

  const columns = useMemo(
    () => createAdmisionColumns({ dateTimeTrigger, onPrint: handlePrintRow }),
    [dateTimeTrigger, handlePrintRow],
  );
  console.log(data.rows);
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
          columnsManagement: {
            getTogglableColumns: (columns) =>
              columns
                .filter((c) => !ALWAYS_HIDDEN_FIELDS.includes(c.field))
                .map((c) => c.field),
          },
        }}
        slots={{
          toolbar: () => (
            <AdmisionHistoryToolbar
              columns={columns}
              showQuickFilter
              dateTimeTrigger={dateTimeTrigger}
              onChangeDateTime={(value) => setDateTimeTrigger(value)}
              quickFilterProps={{
                debounceMs: 400,
                slotProps: {
                  root: { placeholder: "نام بیمار | نام دکتر | کد ملی " },
                },
              }}
              rows={data?.rows ?? []}
              sx={{ justifyContent: "flex-start" }}
            />
          ),
        }}
        loading={isLoading}
      />

      <Typography variant="caption" color="text.secondary">
        برای مشاهده ی جزئیات شارژ ها میتوانید پرینت کنید
      </Typography>
    </Box>
  );
};
