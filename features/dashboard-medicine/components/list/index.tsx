"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridSortModel,
} from "@mui/x-data-grid";
import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
  Tooltip,
  IconButton,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import dayjs from "@/features/core/utils/dayjs";
import { getServerTime } from "@/features/core/actions/time";
import useSWR from "swr";
import { MedicineDialog } from "./medicineDialog";
import { useNotificationStore } from "@/features/core";
import { Row, Charge } from "./type";
import { ChargeMedicineDialog } from "./chargeMedicineDialog";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { GridToolbar, GridToolbarProps } from "@mui/x-data-grid/internals";
const formMapper = {
  pill: "قرص",
  cyrup: "شربت",
  oitment: "پماد",
  injection: "تزریقی",
};
export const DashboardMedicineList = () => {
  const [open, setOpen] = useState(false);
  const [openCharge, setOpenCharge] = useState(false);
  const [charge, setCharge] = useState<Charge | undefined>(undefined);

  const [medicine, setMedicine] = useState<Row | undefined>(undefined);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
    quickFilterValues: [],
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [serverNowIso, setServerNowIso] = useState<string | null>(null);
  const [showExpired, setShowExpired] = useState(false);
  const { show } = useNotificationStore();

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      getServerTime().then((d) => setServerNowIso(d.gregorianIso));
    }
    return () => {
      mounted = false;
    };
  }, []);

  const baseToday = useMemo(() => {
    return serverNowIso ? dayjs(serverNowIso).startOf("day") : null;
  }, [serverNowIso]);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(paginationModel.page));
    params.set("pageSize", String(paginationModel.pageSize));
    params.set("sort", JSON.stringify(sortModel));
    params.set("filter", JSON.stringify(filterModel));

    if (showExpired) params.set("expired", "true");

    return `/api/dashboard/medicine/list?${params.toString()}`;
  }, [paginationModel, sortModel, filterModel, showExpired]);

  const { data, isLoading, mutate } = useSWR(query);

  useEffect(() => {
    if (data && !data.ok) show(data.message, "error");
  }, [data]);

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "id", headerName: "آیدی", width: 90 },
      { field: "name", headerName: "نام دارو", flex: 1, minWidth: 160 },
      {
        field: "form",
        headerName: "فرم",
        width: 120,
        renderCell: (params) =>
          formMapper[params.value as keyof typeof formMapper],
      },
      {
        field: "createdAt",
        headerName: "تاریخ ثبت",
        width: 140,
        valueFormatter: (v) => dayjs(v).calendar("jalali").format("YYYY/MM/DD"),
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
        valueGetter: (params, row) =>
          (row.charges as Charge[]).reduce(
            (sum, c) => sum + (c.quantity ?? 0),
            0,
          ),
      },
      {
        field: "minDaysToExpire",
        headerName: "روز تا انقضا",
        width: 140,
        align: "center",
        headerAlign: "center",
        sortable: false,
        renderCell: (params) => {
          const ch = params.row.charges as Charge[];
          if (!ch?.length || !baseToday) return "—";

          const minDays = Math.min(
            ...ch.map((c) =>
              dayjs(c.expiryDate).startOf("day").diff(baseToday, "day"),
            ),
          );

          const warnDays = Math.min(...ch.map((c) => c.expiryAlertDays ?? 0));
          const isWarn = minDays <= warnDays;
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
          const ch = params.value as Charge[];
          if (!ch?.length || !baseToday) return "—";

          return (
            <Stack
              direction="row"
              spacing={0.5}
              useFlexGap
              sx={{ flexWrap: "wrap", width: "100%", py: 0.5 }}
            >
              {ch.map((c) => {
                const daysToExpire = dayjs(c.expiryDate)
                  .startOf("day")
                  .diff(baseToday, "day");
                const isWarn = daysToExpire <= c.expiryAlertDays;

                return (
                  <Tooltip
                    key={c.medicineId}
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
                      label={`${c.quantity} - ${dayjs(c.chargeCreateAt).format("YYYY/MM/DD")} - exp:${dayjs(c.expiryDate).format("YYYY/MM/DD")}`}
                      sx={{
                        cursor: "pointer",
                        bgcolor: isWarn ? "error.main" : "default",
                        color: isWarn ? "#fff" : "inherit",
                        fontWeight: isWarn ? 600 : 400,
                      }}
                      slotProps={{
                        root: {
                          onClick: () => {
                            setCharge(c as Charge);
                            setOpenCharge(true);
                            setMedicine(params.row);
                          },
                        },
                      }}
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
                onClick={() => {
                  setMedicine(params.row as Row);
                  setOpen(true);
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="افزودن شارژ">
              <IconButton
                size="small"
                color="primary"
                onClick={() => {
                  setCharge(undefined);
                  setOpenCharge(true);
                  setMedicine(params.row);
                }}
              >
                <AddCircleOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [baseToday],
  );
  const EnhancedToolbar = (props: GridToolbarProps) => {
    return (
      <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
        <GridToolbar {...props} />
        <FormControlLabel
          sx={{ ml: 2 }}
          control={
            <Checkbox
              checked={showExpired}
              onChange={(e) => setShowExpired(e.target.checked)}
              color="error"
            />
          }
          label="فقط داروهای منقضی"
        />
        <Button
          variant="contained"
          sx={{
            ml: 2,
          }}
          onClick={() => {
            setMedicine(undefined);
            setOpen(true);
          }}
        >
          افزودن دارو جدید
        </Button>
      </Box>
    );
  };
  return (
    <Box sx={{ width: "100%" }}>
      <MedicineDialog
        onClose={() => setOpen(false)}
        open={open}
        medicine={medicine}
        onSave={() => mutate()}
      />
      <ChargeMedicineDialog
        onClose={() => setOpenCharge(false)}
        open={openCharge}
        charge={charge}
        medicineId={medicine?.id ?? undefined}
        onSave={() => mutate()}
      />

      <Box sx={{ height: 520, width: "100%" }}>
        <DataGrid
          rows={data?.rows ?? []}
          columns={columns}
          rowCount={data?.total ?? 0}
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
          slots={{
            toolbar: EnhancedToolbar,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              sx: { justifyContent: "flex-start" },
              quickFilterProps: { debounceMs: 400 },
            },
          }}
          loading={isLoading}
          getRowHeight={() => "auto"}
          getEstimatedRowHeight={() => 120}
          sx={{
            "& .MuiDataGrid-cell": {
              alignItems: "flex-start",
              py: 1,
            },
            "& .MuiDataGrid-row": {
              maxHeight: "none !important",
            },
            "& .MuiDataGrid-cellContent": {
              whiteSpace: "normal",
              lineHeight: 1.4,
            },
          }}
        />

        <Typography variant="caption" color="text.secondary">
          موجودی = مجموع شارژها | هشدار = کمترین روز تا انقضا ≤ کمترین هشدار
          شارژ | تاریخ امروز میلادی:
          {serverNowIso ? dayjs(serverNowIso).format("YYYY/MM/DD") : "…"}
        </Typography>
      </Box>
    </Box>
  );
};
