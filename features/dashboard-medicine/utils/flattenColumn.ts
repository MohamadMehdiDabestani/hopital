import { GridColDef } from "@mui/x-data-grid";

export const medicineExcelColumns: GridColDef[] = [
  { field: "name", headerName: "نام دارو", width: 180 },
  { field: "form", headerName: "فرم", width: 120 },
  { field: "createdAt", headerName: "تاریخ ثبت", width: 120 },
  { field: "isActive", headerName: "وضعیت", width: 100 },
  { field: "stock", headerName: "موجودی کل", width: 110 },
  { field: "minDaysToExpire", headerName: "کمترین روز تا انقضا", width: 160 },

  { field: "chargeQuantity", headerName: "تعداد شارژ", width: 110 },
  { field: "chargeCreateAt", headerName: "تاریخ ورود شارژ", width: 140 },
  { field: "chargeExpiryDate", headerName: "تاریخ انقضا شارژ", width: 140 },
  { field: "chargeStorageLocation", headerName: "محل نگهداری", width: 160 },
  { field: "chargeNotes", headerName: "توضیحات اضافه شارژ", width: 160 },
];
