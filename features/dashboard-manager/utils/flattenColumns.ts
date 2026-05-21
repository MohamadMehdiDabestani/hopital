import { GridColDef } from "@mui/x-data-grid";

export const managerExcelColumns: GridColDef[] = [
  { field: "firstName", headerName: "نام", width: 180 },
  { field: "lastName", headerName: "نام خانوادگی", width: 120 },
  { field: "codeMeli", headerName: "کد ملی", width: 120 },
  { field: "phone", headerName: "شماره موبایل", width: 100 },
  { field: "lastLoginAt", headerName: "آخرین ورود", width: 110 },
  { field: "role", headerName: "نقش", width: 160 },
];
