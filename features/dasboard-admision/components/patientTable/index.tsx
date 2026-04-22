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
  Box,
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
  nationalId: string;
  enteredAt: string; // ISO
  status: Status;
};

const rows: ReceptionRow[] = [
  {
    id: 1,
    fullName: "علی رضایی",
    nationalId: "1234567890",
    enteredAt: "2026-04-22T08:15:00Z",
    status: "در انتظار",
  },
  {
    id: 2,
    fullName: "زهرا کاظمی",
    nationalId: "0987654321",
    enteredAt: "2026-04-22T09:05:00Z",
    status: "داخل مطب",
  },
  {
    id: 3,
    fullName: "مهدی احمدی",
    nationalId: "1122334455",
    enteredAt: "2026-04-22T07:45:00Z",
    status: "تعلیق",
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
type SortKey = "fullName" | "nationalId" | "enteredAt";

export const ReceptionTable = () => {
  const [query, setQuery] = useState("");
  const [orderBy, setOrderBy] = useState<SortKey>("enteredAt");
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
        r.nationalId.toLowerCase().includes(q)
    );
  }, [query]);

  const sortedRows = useMemo(() => {
    const sorted = [...filteredRows].sort((a, b) => {
      let aVal: string | number = a[orderBy];
      let bVal: string | number = b[orderBy];

      if (orderBy === "enteredAt") {
        aVal = new Date(a.enteredAt).getTime();
        bVal = new Date(b.enteredAt).getTime();
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
    <Paper sx={{ mt:2,p:2, display: "grid", gap: 2 }} >
      <TextField
        placeholder="جستجو بر اساس نام یا کد ملی"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{mb:2}}
      />

      <TableContainer sx={t => ({border: `1px solid ${t.palette.grey['A200']}`})}>
        <Table  >
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

              <TableCell
                sortDirection={orderBy === "nationalId" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "nationalId"}
                  direction={orderBy === "nationalId" ? order : "asc"}
                  onClick={() => handleSort("nationalId")}
                >
                  کد ملی
                </TableSortLabel>
              </TableCell>

              <TableCell
                sortDirection={orderBy === "enteredAt" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "enteredAt"}
                  direction={orderBy === "enteredAt" ? order : "asc"}
                  onClick={() => handleSort("enteredAt")}
                >
                  تاریخ و ساعت ورود
                </TableSortLabel>
              </TableCell>

              <TableCell>وضعیت</TableCell>
              <TableCell>عملیات</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.fullName}</TableCell>
                <TableCell>{row.nationalId}</TableCell>
                <TableCell>{formatTehran(row.enteredAt)}</TableCell>
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
