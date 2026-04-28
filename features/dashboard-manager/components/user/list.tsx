"use client";
import { useMemo, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridSortModel,
} from "@mui/x-data-grid";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import dayjs from "@/features/core/utils/dayjs";
import { UserDialog } from "./userDialog";

type User = {
  id: string ;
  firstName: string;
  lastName: string;
  codeMeli: string;
  phone: string;
  lastLoginAt: string; // ISO
  role: string;
  status: "active" | "suspended";
};
const users = [
  {
    id: 1,
    firstName: "علی",
    lastName: "رضایی",
    codeMeli: "0012345678",
    phone: "09121234567",
    lastLoginAt: "2026-04-27T14:35:00+03:30",
    role: "admin",
    status: "active",
  },
  {
    id: 2,
    firstName: "مریم",
    lastName: "کاظمی",
    codeMeli: "0023456789",
    phone: "09129876543",
    lastLoginAt: "2026-04-28T09:10:00+03:30",
    role: "doctor",
    status: "active",
  },
  {
    id: 3,
    firstName: "سجاد",
    lastName: "محمدی",
    codeMeli: "0034567890",
    phone: "09351234567",
    lastLoginAt: "2026-04-26T18:20:00+03:30",
    role: "doctor",
    status: "suspended",
  },
  {
    id: 4,
    firstName: "زهرا",
    lastName: "قاسمی",
    codeMeli: "0045678901",
    phone: "09133445566",
    lastLoginAt: "2026-04-25T11:05:00+03:30",
    role: "admision",
    status: "active",
  },
  {
    id: 5,
    firstName: "حسین",
    lastName: "یوسفی",
    codeMeli: "0056789012",
    phone: "09221239876",
    lastLoginAt: "2026-04-24T22:45:00+03:30",
    role: "medicine",
    status: "active",
  },
];
export const UsersList = () => {
  // --- server state (mock) ---
  const [open, setOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
    quickFilterValues: [],
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  const handleFilterModelChange = (model: GridFilterModel) => {
    setFilterModel(model);

    const columnFilters = model.items
      .filter(
        (it) => it.field && it.operator && it.value != null && it.value !== "",
      )
      .map((it) => ({
        field: it.field!,
        operator: it.operator!,
        value: it.value!,
      }));

    const quick = (model.quickFilterValues ?? [])
      .map((v) => String(v).trim())
      .filter(Boolean);

    console.log({ columnFilters, quick });
  };

  // --- mock server processing ---
  const { rows, rowCount } = useMemo(() => {
    let data = [...users];

    const quick = (filterModel.quickFilterValues ?? [])
      .map((v) => String(v).toLowerCase().trim())
      .filter(Boolean);

    if (quick.length) {
      data = data.filter((u) =>
        quick.every(
          (q) =>
            String(u.id).toLowerCase().includes(q) ||
            `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
            u.codeMeli.toLowerCase().includes(q) ||
            u.phone.toLowerCase().includes(q) ||
            u.role.toLowerCase().includes(q) ||
            (u.status === "active" ? "فعال" : "تعلیق").includes(q),
        ),
      );
    }

    if (sortModel[0]) {
      const { field, sort } = sortModel[0];
      data.sort((a: any, b: any) => {
        const av = a[field];
        const bv = b[field];
        if (av == null && bv == null) return 0;
        if (av == null) return 1;
        if (bv == null) return -1;

        if (typeof av === "number" && typeof bv === "number") {
          return sort === "asc" ? av - bv : bv - av;
        }
        return sort === "asc"
          ? String(av).localeCompare(String(bv))
          : String(bv).localeCompare(String(av));
      });
    }

    const count = data.length;
    const start = paginationModel.page * paginationModel.pageSize;
    const end = start + paginationModel.pageSize;

    return { rows: data.slice(start, end), rowCount: count };
  }, [users, filterModel, sortModel, paginationModel]);

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
      valueFormatter: (params) =>
        params ? dayjs(params).format("YYYY/MM/DD HH:mm") : "—",
    },
    { field: "role", headerName: "نقش", width: 120 },
    {
      field: "status",
      headerName: "وضعیت",
      width: 120,
      renderCell: (params) => {
        const active = params.value === "active";
        return (
          <Chip
            size="small"
            label={active ? "فعال" : "تعلیق"}
            color={active ? "success" : "warning"}
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
            setUser(params.row as User);
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
      <UserDialog onClose={() => setOpen(false)} open={open} user={user} />
      <Box sx={{ height: 520, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          rowCount={rowCount}
          getRowId={(row) => row.id}
          paginationMode="server"
          filterMode="server"
          sortingMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          filterModel={filterModel}
          onFilterModelChange={handleFilterModelChange}
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
