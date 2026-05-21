"use client";

import { Chip, IconButton, Tooltip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { UserRow } from "@/features/dashboard-manager/type";
import { DateTimeTrigger, formatDate } from "@/features/core";

type Params = {
  dateTimeTrigger: DateTimeTrigger;
  onEditUser: (row: UserRow) => void;
};

export const createManagerColumns = ({
  dateTimeTrigger,
  onEditUser,
}: Params): GridColDef[] => {
  const isGregorian = dateTimeTrigger === "miladi";

  return [
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
      valueFormatter: (value) => formatDate(value, isGregorian),
    },
    { field: "role", headerName: "نقش", width: 120 },
    {
      field: "status",
      headerName: "وضعیت",
      width: 120,
      valueFormatter: (value, row) => (row.suspended ? "غیر فعال" : "فعال"),

      renderCell: (params) => {
        return (
          <Chip
            size="small"
            label={params.row.suspended ? "تعلیق" : "فعال"}
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
        <Tooltip title="ویرایش کاربر">
          <IconButton
            color="warning"
            size="small"
            onClick={() => onEditUser(params.row as UserRow)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];
};
