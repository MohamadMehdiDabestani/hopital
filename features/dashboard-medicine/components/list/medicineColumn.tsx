"use client";

import { Box, Chip, IconButton, Stack, Tooltip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import dayjs from "@/features/core/utils/dayjs";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  Charge,
  DateTimeTrigger,
  Row,
} from "@/features/dashboard-medicine/type";
import { formMedicineMapper } from "@/features/dashboard-medicine/const";
import {
  getMedicineStock,
  getMinDaysToExpire,
  getMinWarnDays,
  isChargeWarn,
} from "@/features/dashboard-medicine/utils/medicineList";
import { formatDate } from "@/features/core";

type Params = {
  baseToday: dayjs.Dayjs | null;
  dateTimeTrigger: DateTimeTrigger;
  onEditMedicine: (row: Row) => void;
  onAddCharge: (row: Row) => void;
  onEditCharge: (charge: Charge, row: Row) => void;
};

export const createMedicineColumns = ({
  baseToday,
  onEditMedicine,
  onAddCharge,
  onEditCharge,
  dateTimeTrigger,
}: Params): GridColDef[] => {
  const isGregorian = dateTimeTrigger === "miladi";

  return [
    { field: "id", headerName: "آیدی", width: 90 },

    { field: "name", headerName: "نام دارو", flex: 1, minWidth: 160 },

    {
      field: "form",
      headerName: "فرم",
      width: 120,
      renderCell: (params) =>
        formMedicineMapper[params.value as keyof typeof formMedicineMapper],
    },

    {
      field: "createdAt",
      headerName: "تاریخ ثبت",
      width: 140,
      valueFormatter: (value) => formatDate(value, isGregorian),
    },

    {
      field: "isActive",
      headerName: "فعال",
      width: 90,
      align: "center",
      headerAlign: "center",
      renderCell: (p) =>
        p.value ? (
          <CheckCircleIcon color="success" />
        ) : (
          <CancelIcon color="error" />
        ),
    },

    {
      field: "stock",
      headerName: "موجودی",
      width: 120,
      align: "center",
      headerAlign: "center",
      sortable: false,
      valueGetter: (_, row) => getMedicineStock(row.charges as Charge[]),
    },

    {
      field: "minDaysToExpire",
      headerName: "روز تا انقضا",
      width: 140,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => {
        const charges = params.row.charges as Charge[];
        const minDays = getMinDaysToExpire(charges, baseToday);
        const minWarnDays = getMinWarnDays(charges);

        if (minDays === null || minWarnDays === null) return "—";

        const isWarn = minDays <= minWarnDays;

        return (
          <Box
            sx={{
              px: 1,
              py: 0.5,
              borderRadius: 1,
              bgcolor: isWarn ? "error.main" : "transparent",
              color: isWarn ? "#fff" : "inherit",
              fontWeight: isWarn ? 600 : 400,
              width: "100%",
              textAlign: "center",
            }}
          >
            {minDays} روز
          </Box>
        );
      },
    },

    {
      field: "charges",
      headerName: "شارژها (تعداد + تاریخ ورود + تاریخ انقضا)",
      flex: 1,
      minWidth: 240,
      sortable: false,
      renderCell: (params) => {
        const charges = params.value as Charge[];
        if (!charges?.length || !baseToday) return "—";
        return (
          <Stack
            direction="row"
            spacing={0.5}
            useFlexGap
            sx={{ flexWrap: "wrap", width: "100%", py: 0.5 }}
          >
            {charges.map((c) => {
              const isWarn = isChargeWarn(c, baseToday);

              const chargeCreateAtFormatted = formatDate(c.chargeCreateAt, isGregorian);

              const expiryDateFormatted = formatDate(c.expiryDate, isGregorian);
              return (
                <Tooltip
                  key={`${c.medicineId}-${c.expiryDate}-${c.chargeCreateAt}`}
                  title={`${
                    c.storageLocation
                      ? `محل: ${c.storageLocation}`
                      : "محل نامشخص"
                  } (برای ویرایش کلیک کنید)`}
                  arrow
                  placement="left-start"
                >
                  <Chip
                    size="small"
                    label={`${c.quantity} - ${chargeCreateAtFormatted} - exp:${expiryDateFormatted}`}
                    sx={{
                      cursor: "pointer",
                      bgcolor: isWarn ? "error.main" : "default",
                      color: isWarn ? "#fff" : "inherit",
                      fontWeight: isWarn ? 600 : 400,
                    }}
                    onClick={() => onEditCharge(c, params.row as Row)}
                  />
                </Tooltip>
              );
            })}
          </Stack>
        );
      },
    },

    {
      field: "actions",
      headerName: "عملیات",
      width: 140,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="ویرایش دارو">
            <IconButton
              color="warning"
              size="small"
              onClick={() => onEditMedicine(params.row as Row)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="افزودن شارژ">
            <IconButton
              size="small"
              color="primary"
              onClick={() => onAddCharge(params.row as Row)}
            >
              <AddCircleOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];
};
