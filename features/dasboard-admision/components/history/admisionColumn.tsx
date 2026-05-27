"use client";

import { Chip, IconButton, Tooltip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

import PrintIcon from "@mui/icons-material/Print";
import { DateTimeTrigger, formatDateWithTime } from "@/features/core";
import { statusColor, statusFa } from "../../const";

type Params = {
  dateTimeTrigger: DateTimeTrigger;
  onPrint: (row: any) => void;
};

export const createAdmisionColumns = ({
  dateTimeTrigger,
  onPrint,
}: Params): GridColDef[] => {
  const isGregorian = dateTimeTrigger === "miladi";

  return [
    { field: "id" }, // ALWAYS HIDE

    { field: "firstName" }, // ALWAYS HIDE
    { field: "lastName" }, // ALWAYS HIDE
    {
      field: "fullName",
      headerName: "نام و نام خانوادگی بیمار",
      flex: 1.5,
      minWidth: 180,
      valueGetter: (params, row) => `${row.firstName} ${row.lastName}`,
    },
    { field: "doctorFirstName" }, // ALWAYS HIDE
    { field: "doctorLastName" }, // ALWAYS HIDE
    {
      field: "doctorFullName",
      headerName: "نام و نام خانوادگی دکتر",
      flex: 1.5,
      minWidth: 180,
      valueGetter: (params, row) =>
        `${row.doctorFirstName} ${row.doctorLastName}`,
    },
    {
      field: "codeMeli",
      headerName: "کد ملی بیمار",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "receptionTime",
      headerName: "تاریخ و زمان پذیرش",
      flex: 2,
      minWidth: 180,
      valueFormatter: (value) => formatDateWithTime(value, isGregorian),
    },
    {
      field: "treatTime",
      headerName: "تاریخ و زمان ورود به اتاق",
      flex: 2,
      minWidth: 180,
      valueFormatter: (value) => formatDateWithTime(value, isGregorian),
    },
    {
      field: "exitRoomAt",
      headerName: "تاریخ و زمان خروج از اتاق",
      flex: 2,
      minWidth: 180,
      valueFormatter: (value) => formatDateWithTime(value, isGregorian),
    },
    {
      field: "reciveMedicineTime",
      headerName: "تاریخ و زمان دریافت دارو",
      flex: 2,
      minWidth: 180,
      valueFormatter: (value) => formatDateWithTime(value, isGregorian),
    },
    {
      field: "medicines",
      headerName: "دارو ها",
      flex: 1.5,
      minWidth: 150,
      sortable: false,
      filterable: false,
      valueGetter: (_, row) => {
        if (row.medicines == null) return "--";
        return row.medicines.map((m: any) => m.name).join(" | ");
      },
    },
    {
      field: "status",
      headerName: "وضعیت",
      width: 100,
      flex: 0.8,
      minWidth: 90,
      valueFormatter: (value) => statusFa[value],
      renderCell: (p) => (
        <Chip
          label={statusFa[p.value]}
          color={statusColor(p.value)}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "عملیات",
      width: 70,
      flex: 0.5,
      minWidth: 60,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Tooltip title="پرینت">
          <IconButton size="small" onClick={() => onPrint(params.row)}>
            <PrintIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];
};