"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  TextField,
  TableSortLabel,
} from "@mui/material";
import { useMemo, useState } from "react";

type Status =
  | "در انتظار"
  | "داخل مطب"
  | "اتمام ویزیت"
  | "دریافت دارو"
  | "خروج"
  | "تعلیق";

type ReceptionRow = {
  id: number;
  fullName: string;
  codeMeli: string;
  receptionTime: string; // ISO
  treatTime: string | null; // ISO
  exitRoomAt: string | null;
  status: Status;
};

const rows: ReceptionRow[] = [
  {
    id: 1,
    fullName: "علی رضایی",
    codeMeli: "1234567890",
    receptionTime: "2026-04-22T08:15:00Z",
    treatTime: null,
    exitRoomAt: null,
    status: "در انتظار",
  },
  {
    id: 2,
    fullName: "زهرا کاظمی",
    codeMeli: "0987654321",
    receptionTime: "2026-04-22T09:05:00Z",
    treatTime: "2026-04-22T09:05:00Z",
    status: "داخل مطب",
    exitRoomAt: null,
  },
  {
    id: 3,
    fullName: "مهدی احمدی",
    codeMeli: "1122334455",
    receptionTime: "2026-04-22T07:45:00Z",
    status: "تعلیق",
    exitRoomAt: null,
    treatTime: null,
  },
];

const formatTehran = (iso: string) => {
  const dtf = new Intl.DateTimeFormat("fa-IR-u-nu-latn", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Asia/Tehran",
  });
  return dtf.format(new Date(iso));
};

const statusColor = (s: Status) => {
  switch (s) {
    case "در انتظار":
      return "warning";
    case "داخل مطب":
      return "info";
    case "اتمام ویزیت":
      return "success";
    case "دریافت دارو":
      return "primary";
    case "خروج":
      return "default";
    case "تعلیق":
      return "error";
  }
};

type Order = "asc" | "desc";
type SortKey =
  | "fullName"
  | "codeMeli"
  | "receptionTime"
  | "treatTime"
  | "exitRoomAt";

export const ReceptionTable = () => {
  const [query, setQuery] = useState("");
  const [orderBy, setOrderBy] = useState<SortKey>("receptionTime");
  const [order, setOrder] = useState<Order>("desc");

  const handleSort = (key: SortKey) => {
    if (orderBy === key) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setOrderBy(key);
      setOrder("asc");
    }
  };

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(
      (r) =>
        r.fullName.toLowerCase().includes(q) ||
        r.codeMeli.toLowerCase().includes(q),
    );
  }, [query]);
  const normalize = (v: string | null | number) => {
    if (v === null) return -Infinity; // یا Infinity بسته به اینکه null آخر/اول بیاید
    return typeof v === "string" ? new Date(v).getTime() : v;
  };
  const sortedRows = useMemo(() => {
    const sorted = [...filteredRows].sort((a, b) => {
      let aVal: string | number = normalize(a[orderBy]);
      let bVal: string | number = normalize(b[orderBy]);

      if (orderBy === "receptionTime") {
        aVal = new Date(a.receptionTime).getTime();
        bVal = new Date(b.receptionTime).getTime();
      }

      if (aVal < bVal) return order === "asc" ? -1 : 1;
      if (aVal > bVal) return order === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredRows, orderBy, order]);

  const handleSuspend = (row: ReceptionRow) => {
    // TODO: API call or state update
    console.log("Suspend:", row.id);
  };

  return (
    <Paper sx={{ mt: 2, p: 2, display: "grid", gap: 2 }}>
      <TextField
        label="جستجو بر اساس نام یا کد ملی"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TableContainer
        sx={(t) => ({ border: `1px solid ${t.palette.grey["A200"]}` })}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sortDirection={orderBy === "fullName" ? order : false}>
                <TableSortLabel
                  active={orderBy === "fullName"}
                  direction={orderBy === "fullName" ? order : "asc"}
                  onClick={() => handleSort("fullName")}
                >
                  نام و نام خانوادگی
                </TableSortLabel>
              </TableCell>

              <TableCell sortDirection={orderBy === "codeMeli" ? order : false}>
                <TableSortLabel
                  active={orderBy === "codeMeli"}
                  direction={orderBy === "codeMeli" ? order : "asc"}
                  onClick={() => handleSort("codeMeli")}
                >
                  کد ملی
                </TableSortLabel>
              </TableCell>

              <TableCell
                sortDirection={orderBy === "receptionTime" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "receptionTime"}
                  direction={orderBy === "receptionTime" ? order : "asc"}
                  onClick={() => handleSort("receptionTime")}
                >
                  تاریخ و ساعت ورود
                </TableSortLabel>
              </TableCell>
              <TableCell> تاریخ و ساعت ورود به مطب</TableCell>
              <TableCell> تاریخ و ساعت خروج از مطب</TableCell>
              <TableCell>وضعیت</TableCell>
              <TableCell>عملیات</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.fullName}</TableCell>
                <TableCell>{row.codeMeli}</TableCell>
                <TableCell>{formatTehran(row.receptionTime)}</TableCell>
                <TableCell>{row.treatTime ?formatTehran(row.treatTime) : "--"}</TableCell>
                <TableCell>{row.exitRoomAt ? formatTehran(row.exitRoomAt) : "--"}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    color={statusColor(row.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    onClick={() => handleSuspend(row)}
                    disabled={row.status === "تعلیق"}
                  >
                    تعلیق
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {sortedRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  نتیجه‌ای پیدا نشد
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
