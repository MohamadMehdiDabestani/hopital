"use client";

import { useMemo, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "@/features/core/utils/dayjs";
import { Charge, DateTimeTrigger, Row } from "@/features/dashboard-medicine/type";
import { MedicineDialog } from "./medicineDialog";
import { ChargeMedicineDialog } from "./chargeMedicineDialog";
import { useMedicineList } from "@/features/dashboard-medicine/hooks/useMedicineList";
import { createMedicineColumns } from "./medicineColumn";
import { MedicineListToolbar } from "./medicineToolbar";


export const DashboardMedicineList = ({initialData} : {initialData : any}) => {
  const [open, setOpen] = useState(false);
  const [openCharge, setOpenCharge] = useState(false);
  const [medicine, setMedicine] = useState<Row | undefined>(undefined);
  const [charge, setCharge] = useState<Charge | undefined>(undefined);
  const [dateTimeTrigger , setDateTimeTrigger] = useState<DateTimeTrigger>('shamsi')

  const {
    data,
    isLoading,
    mutate,
    paginationModel,
    setPaginationModel,
    filterModel,
    setFilterModel,
    sortModel,
    setSortModel,
    showExpired,
    setShowExpired,
    serverNowIso,
    baseToday,
  } = useMedicineList({initialData});

  const columns = useMemo(
    () =>
      createMedicineColumns({
        baseToday,
        onEditMedicine: (row) => {
          setMedicine(row);
          setOpen(true);
        },
        onAddCharge: (row) => {
          setMedicine(row);
          setCharge(undefined);
          setOpenCharge(true);
        },
        onEditCharge: (selectedCharge, row) => {
          setMedicine(row);
          setCharge(selectedCharge);
          setOpenCharge(true);
        },
        dateTimeTrigger
      }),
    [baseToday , dateTimeTrigger],
  );

  return (
    <Box sx={{ width: "100%" }}>
      <MedicineDialog
        open={open}
        medicine={medicine}
        onClose={() => setOpen(false)}
        onSave={() => mutate()}
      />

      <ChargeMedicineDialog
        open={openCharge}
        charge={charge}
        medicineId={medicine?.id ?? undefined}
        onClose={() => setOpenCharge(false)}
        onSave={() => mutate()}
      />
      
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
          showToolbar
          disableColumnFilter
          columnVisibilityModel={{ id: false }}
          slots={{
            toolbar: () => (
              <MedicineListToolbar
                showQuickFilter
                dateTimeTrigger={dateTimeTrigger}
                onChangeDateTime={(value) => setDateTimeTrigger(value)}
                quickFilterProps={{
                  debounceMs: 400,
                  slotProps: {
                    root: { placeholder: "نام دارو | محل ذخیره سازی" },
                  },
                }}
                baseToday={baseToday}
                rows={data?.rows ?? []}
                sx={{ justifyContent: "flex-start" }}
                showExpired={showExpired}
                onToggleExpired={setShowExpired}
                onAddMedicine={() => {
                  setMedicine(undefined);
                  setOpen(true);
                }}
              />
            ),
          }}
          loading={isLoading}
          getRowHeight={() => "auto"}
          getEstimatedRowHeight={() => 120}
          sx={{
            "& .MuiDataGrid-cell": {
              alignItems: "flex-start",
              py: 1,
            },
            "& .MuiDataGrid-row": {
              maxHeight: "none !important",
            },
            "& .MuiDataGrid-cellContent": {
              whiteSpace: "normal",
              lineHeight: 1.4,
            },
          }}
        />

        <Typography variant="caption" color="text.secondary">
          موجودی = مجموع شارژها | هشدار = کمترین روز تا انقضا ≤ کمترین هشدار
          شارژ | تاریخ امروز میلادی:
          {serverNowIso ? dayjs(serverNowIso).format("YYYY/MM/DD") : "…"}
        </Typography>
      </Box>
    </Box>
  );
};
