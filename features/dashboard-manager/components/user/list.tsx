"use client";
import { useMemo, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridSortModel,
} from "@mui/x-data-grid";
import { Box, Button, Chip, Typography } from "@mui/material";
import dayjs from "@/features/core/utils/dayjs";
import { UserDialog } from "./userDialog";
import useSWR from "swr";
import { ActionResult } from "@/features/core";
import { ApiResult, UserRow } from "./type";


export const UsersList = () => {
  const [open, setOpen] = useState(false);
  const [row, setRow] = useState<UserRow | undefined>(undefined);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
    quickFilterValues: [],
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  const query = useMemo(() => {
    const params = new URLSearchParams({
      page: String(paginationModel.page),
      pageSize: String(paginationModel.pageSize),
      sort: JSON.stringify(sortModel),
      filter: JSON.stringify(filterModel),
    });
    return `/api/dashboard/manager/users?${params.toString()}`;
  }, [paginationModel, filterModel, sortModel]);

  const { data, isLoading, isValidating, mutate, error } = useSWR<ApiResult>(
    query,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

  const columns: GridColDef[] = [
    { field: "id", headerName: "آیدی", width: 90 },
    {
      field: "fullName",
      headerName: "نام و نام خانوادگی",
      flex: 1,
      minWidth: 180,
      valueGetter: (params, row) => `${row.firstName} ${row.lastName}`,
    },
    { field: "codeMeli", headerName: "کد ملی", width: 140 },
    { field: "phone", headerName: "شماره تماس", width: 140 },
    {
      field: "lastLoginAt",
      headerName: "آخرین ورود",
      width: 180,
      valueFormatter: (value) =>
        value
          ? dayjs(String(value)).calendar("jalali").format("YYYY/MM/DD HH:mm")
          : "—",
    },
    { field: "role", headerName: "نقش", width: 120 },
    {
      field: "status",
      headerName: "وضعیت",
      width: 120,
      renderCell: (params) => {
        return (
          <Chip
            size="small"
            label={params.row.suspended ?  "تعلیق" : "فعال"}
            color={params.row.suspended ? "warning" : "success"}
            variant="outlined"
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "عملیات",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button
          size="small"
          color="info"
          onClick={() => {
            setRow(params.row as UserRow);
            setOpen(true);
          }}
        >
          ویرایش
        </Button>
      ),
    },
  ];
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
      <Box sx={{ height: 520, width: "100%" }}>
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
          showToolbar
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              sx: { justifyContent: "flex-start" },
              quickFilterProps: { debounceMs: 400 },
            },
          }}
        />

        <Typography variant="caption" color="text.secondary">
          جدول کاربران | جستجو: نام، کدملی، شماره تماس، نقش، وضعیت
        </Typography>
      </Box>
    </Box>
  );
};
