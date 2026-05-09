"use client";
import { useEffect, useMemo, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridSortModel,
} from "@mui/x-data-grid";
import { Box, Button, Chip, Typography } from "@mui/material";
import dayjs from "@/features/core/utils/dayjs";
import { SiteDialog } from "./siteDialog";
import {ApiResponse, SiteRow} from './types'
import useSWR from "swr";

export const SiteList = () => {
  const [open, setOpen] = useState(false);
  const [row, setRow] = useState<SiteRow | undefined>(undefined);

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
    return `/api/dashboard/root/sites?${params.toString()}`;
  }, [paginationModel, filterModel, sortModel]);

  const { data, isLoading , isValidating , mutate} = useSWR<ApiResponse>(
    query,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    }
  );

  const columns: GridColDef[] = [
    { field: "id", headerName: "آیدی", width: 90 },
    {
      field: "fullName",
      headerName: "نام و نام خانوادگی",
      flex: 1,
      minWidth: 180,
      valueGetter: (_, row: SiteRow) =>
        `${row.user.firstName} ${row.user.lastName}`,
    },
    {
      field: "codeMeli",
      headerName: "کد ملی",
      width: 140,
      valueGetter: (_, row: SiteRow) => row.user.codeMeli,
    },
    {
      field: "phone",
      headerName: "شماره تماس",
      width: 140,
      valueGetter: (_, row: SiteRow) => row.user.phone,
    },
    {
      field: "lastLoginAt",
      headerName: "آخرین ورود",
      width: 180,
      valueGetter: (_, row: SiteRow) => row.user.lastLoginAt,
      valueFormatter: (value) =>
        value
          ? dayjs(value, "YYYY/MM/DDTHH:mm:ssZ")
              .calendar("jalali")
              .format("YYYY/MM/DD HH:mm")
          : "—",
    },
    { field: "siteName", headerName: "نام مرکز", width: 120 },
    {
      field: "suspended",
      headerName: "وضعیت",
      width: 120,
      renderCell: (params) => {
        return (
          <Chip
            size="small"
            label={params.row.user.suspended ? "تعلیق" :"فعال"}
            color={params.row.user.suspended ? "warning" : "success"}
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
            setRow(params.row);
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
      <SiteDialog onClose={() => {setOpen(false)}} onSvaed={() => mutate()}  open={open} row={row} />
      <Box sx={{ height: 520, width: "100%" }}>
        <DataGrid
          rows={data?.rows ?? []}
          rowCount={data?.total ?? 0}
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
          جدول مراکز | جستجو: نام، کدملی، شماره تماس، مرکز، وضعیت
        </Typography>
      </Box>
    </Box>
  );
};
