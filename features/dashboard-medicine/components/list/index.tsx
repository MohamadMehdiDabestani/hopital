"use client";
import { useMemo, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridSortModel,
} from "@mui/x-data-grid";
import { Box, Chip, Stack, TextField, Typography } from "@mui/material";
import dayjs from "dayjs";

type Medicine = {
  id: string | number;
  name: string;
  warnDays: number;
  location: string;
};

type Charge = {
  id: string | number;
  drugId: string | number;
  qty: number;
  entryDate: string;
  expireDate: string;
};

type Row = Medicine & {
  stock: number;
  minDaysToExpire: number | null;
  charges?: Charge[];
};

const calcStock = (charges: Charge[]) =>
  charges.reduce((sum, c) => sum + c.qty, 0);

const calcMinDaysToExpire = (charges: Charge[]) => {
  if (!charges.length) return null;
  const today = dayjs().startOf("day");
  return Math.min(
    ...charges.map((c) =>
      dayjs(c.expireDate).startOf("day").diff(today, "day"),
    ),
  );
};

export const DashboardMedicineList = ({
  drugs,
  charges,
}: {
  drugs: Medicine[];
  charges: Charge[];
}) => {
  // --- server state ---
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
    quickFilterValues: [],
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  // --- base rows ---
  const baseRows: Row[] = useMemo(() => {
    const byDrug = new Map<string | number, Charge[]>();
    charges.forEach((c) => {
      const arr = byDrug.get(c.drugId) ?? [];
      arr.push(c);
      byDrug.set(c.drugId, arr);
    });

    return drugs.map((d) => {
      const ch = byDrug.get(d.id) ?? [];
      return {
        ...d,
        stock: calcStock(ch),
        minDaysToExpire: calcMinDaysToExpire(ch),
        charges: ch,
      };
    });
  }, [drugs, charges]);
  const handleFilterModelChange = (model: GridFilterModel) => {
    setFilterModel(model);

    // --- فیلترهای ستون ---
    const columnFilters = model.items
      .filter(
        (it) => it.field && it.operator && it.value != null && it.value !== "",
      )
      .map((it) => ({
        field: it.field!,
        operator: it.operator!,
        value: it.value!,
      }));

    // --- Quick Filter (جستجوی سریع Toolbar) ---
    const quick = (model.quickFilterValues ?? [])
      .map((v) => String(v).trim())
      .filter(Boolean);

    // اینا را بفرست به سرور
    console.log({ columnFilters, quick });
  };
  // --- mock server processing ---
  const { rows, rowCount } = useMemo(() => {
    let data = [...baseRows];

    const quick = (filterModel.quickFilterValues ?? [])
      .map((v) => String(v).toLowerCase().trim())
      .filter(Boolean);

    if (quick.length) {
      data = data.filter((r) =>
        quick.every(
          (q) =>
            String(r.id).toLowerCase().includes(q) ||
            r.name.toLowerCase().includes(q) ||
            r.location.toLowerCase().includes(q) ||
            r.charges?.some((c) =>
              dayjs(c.entryDate).format("YYYY/MM/DD").includes(q.trim()),
            ),
        ),
      );
    }
    // sorting
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

    return {
      rows: data.slice(start, end),
      rowCount: count,
    };
  }, [baseRows, filterModel, sortModel, paginationModel]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "آیدی", width: 90 },
    { field: "name", headerName: "نام دارو", flex: 1, minWidth: 160 },
    {
      field: "warnDays",
      headerName: "هشدار (روز)",
      width: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "stock",
      headerName: "موجودی",
      width: 120,
      align: "center",
      headerAlign: "center",
    },
    { field: "location", headerName: "محل ذخیره‌سازی", flex: 1, minWidth: 160 },
    {
      field: "minDaysToExpire",
      headerName: "روز تا انقضا",
      width: 140,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const warnDays = params.row.warnDays as number;
        const minDays = params.value as number | null;
        const isWarn = minDays !== null && minDays <= warnDays;

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
            {minDays === null ? "—" : `${minDays} روز`}
          </Box>
        );
      },
    },

    {
      field: "charges",
      headerName: "شارژها (تاریخ ورود + تعداد)",
      flex: 1,
      minWidth: 240,
      sortable: false,

      renderCell: (params) => {
        const ch = params.value as Charge[];
        const warnDays = params.row.warnDays as number;
        if (!ch?.length) return "—";
        return (
          <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap" }}>
            {ch.map((c) => {
              const daysToExpire = dayjs(c.expireDate)
                .startOf("day")
                .diff(dayjs().startOf("day"), "day");
              const isWarn = daysToExpire <= warnDays;

              return (
                <Chip
                  key={c.id}
                  size="small"
                  label={`${dayjs(c.entryDate).format("YYYY/MM/DD")} - ${c.qty}`}
                  sx={{
                    bgcolor: isWarn ? "error.main" : "default",
                    color: isWarn ? "#fff" : "inherit",
                    fontWeight: isWarn ? 600 : 400,
                  }}
                />
              );
            })}
          </Stack>
        );
      },
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
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
          // ✅ Toolbar داخلی (Search + Filter + Export...)
          // slots={{ toolbar: GridToolbar }}
          showToolbar
          slotProps={{
            toolbar: {
              showQuickFilter: true, // سرچ داخلی
              sx: { justifyContent: "flex-start" },

              quickFilterProps: { debounceMs: 400 }, // دیباونس
            },
          }}
        />

        <Typography variant="caption" color="text.secondary">
          موجودی = مجموع شارژها | هشدار = کمترین روز تا انقضا ≤ مقدار هشدار دارو
        </Typography>
      </Box>
    </Box>
  );
};
