"use client";
import { useMemo, useState, useEffect, useCallback } from "react";
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridSortModel,
} from "@mui/x-data-grid";
import { Box, Button, Typography } from "@mui/material";
import { UserDialog } from "./userDialog";
import { DateTimeTrigger } from "@/features/core";
import { UserRow } from "../../type";
import { createManagerColumns } from "./managerColumn";
import { ManagerToolbar } from "./managerToolbar";
import { useUsersList } from "../../hooks/useUsersList";

export const UsersList = ({ initialData }: { initialData: any }) => {
  const [open, setOpen] = useState(false);
  const [row, setRow] = useState<UserRow | undefined>(undefined);
  const [dateTimeTrigger, setDateTimeTrigger] =
    useState<DateTimeTrigger>("shamsi");
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
    isValidating,
  } = useUsersList({ initialData });

  const columns = useMemo(
    () =>
      createManagerColumns({
        dateTimeTrigger,
        onEditUser: (row) => {
          setRow(row);
          setOpen(true);
        },
      }),
    [dateTimeTrigger],
  );
  return (
    <Box sx={{ width: "100%" }}>
      <Button
        onClick={() => {
          setOpen(true);
          setRow(undefined);
        }}
      >
        افزودن کارمند جدید
      </Button>
      <UserDialog
        onSaved={() => mutate()}
        onClose={() => setOpen(false)}
        open={open}
        row={row}
      />
      <Box sx={{ height: 750, width: "100%" }}>
        <DataGrid
          rows={data?.rows ?? []}
          rowCount={Number(data?.total ?? 0)}
          loading={isLoading || isValidating}
          columns={columns}
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
          columnVisibilityModel={{ id: false }}
          showToolbar
          slots={{
            toolbar: () => (
              <ManagerToolbar
                columns={columns}
                showQuickFilter
                dateTimeTrigger={dateTimeTrigger}
                onChangeDateTime={(value) => setDateTimeTrigger(value)}
                quickFilterProps={{
                  debounceMs: 400,
                  slotProps: {
                    root: { placeholder: "نام | کد ملی | شماره تماس" },
                  },
                }}
                rows={data?.rows ?? []}
                sx={{ justifyContent: "flex-start" }}
                onAddUser={() => {
                  setRow(undefined);
                  setOpen(true);
                }}
              />
            ),
          }}
        />

        <Typography variant="caption" color="text.secondary">
          جدول کاربران | جستجو: نام، کدملی، شماره تماس، نقش، وضعیت
        </Typography>
      </Box>
    </Box>
  );
};
