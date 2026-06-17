"use client";

import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { UserRow } from "@/features/dashboard-manager/type";
import { DateTimeTrigger, formatDateWithTime } from "@/features/core";
import { roleMapper } from "../../const";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

type ResetPasswordMode = "random" | "nationalCode";

type Params = {
  dateTimeTrigger: DateTimeTrigger;
  onEditUser: (row: UserRow) => void;
  // onResetPassword: (userId: number, mode: ResetPasswordMode) => void;
  resetPasswordLoadingId?: number | null;
  onOpenResetMenu: (event: React.MouseEvent<HTMLElement>, row: UserRow) => void;
};

export const createManagerColumns = ({
  dateTimeTrigger,
  onEditUser,
  // onResetPassword,
  onOpenResetMenu,
  resetPasswordLoadingId, // اضافه شد
}: Params): GridColDef[] => {
  const isGregorian = dateTimeTrigger === "miladi";

  return [
    { field: "id", headerName: "آیدی", width: 90 },
    { field: "firstName", headerName: "نام", width: 90 },
    { field: "lastName", headerName: "نام خانوادگی", width: 90 },
    {
      field: "fullName",
      headerName: "نام و نام خانوادگی",
      flex: 1,
      minWidth: 180,
      valueGetter: (params, row) => `${row.firstName} ${row.lastName}`,
    },
    { field: "codeMeli", headerName: "کد ملی", width: 140 },
    { field: "phone", headerName: "شماره موبایل", width: 140 },
    {
      field: "lastLoginAt",
      headerName: "آخرین ورود",
      width: 180,
      valueFormatter: (value) => {
        return formatDateWithTime(value, isGregorian);
      },
    },
    {
      field: "role",
      valueFormatter: (value) => roleMapper[value],
      headerName: "نقش",
      width: 120,
    },
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
      width: 140,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const isResetting = resetPasswordLoadingId === params.row.id;
        return (
          <Box>
            <Tooltip title="ویرایش کاربر">
              <IconButton
                color="warning"
                size="small"
                onClick={() => onEditUser(params.row as UserRow)}
                disabled={isResetting}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="ریست رمز عبور">
              <IconButton
                color="error"
                size="small"
                onClick={(e) => onOpenResetMenu(e, params.row as UserRow)}
                disabled={isResetting}
                data-testid={`openReset${params.row.id}`}
              >
                {isResetting ? (
                  <CircularProgress size={20} color="error" />
                ) : (
                  <RestartAltIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];
};
