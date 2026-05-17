"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  TableSortLabel,
} from "@mui/material";

import { useMemo, useState } from "react";
import { tehranTimezone } from "@/features/core";
import { MedicineDialog } from "./medicineDialog";

type ReceptionRow = {
  id: number;
  fullName: string;
  codeMeli: string;
  receptionTime: Date;
  treatTime: Date | null;
  exitRoomAt: Date | null;
  status: string;
};

type Order = "asc" | "desc";

type SortKey =
  | "fullName"
  | "codeMeli"
  | "receptionTime"
  | "treatTime"
  | "exitRoomAt";

type Props = {
  list: ReceptionRow[];
};

export const DashboardMedicineQueue = ({ list }: Props) => {
  const [query, setQuery] = useState("");
  const [orderBy, setOrderBy] = useState<SortKey>("receptionTime");
  const [order, setOrder] = useState<Order>("desc");
  const [open, setOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<number | null>(null);

  const handleSort = (key: SortKey) => {
    if (orderBy === key) {
      setOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setOrderBy(key);
      setOrder("asc");
    }
  };

  const comparator = (a: ReceptionRow, b: ReceptionRow) => {
    const aVal = a[orderBy];
    const bVal = b[orderBy];

    if (aVal === null) return 1;
    if (bVal === null) return -1;

    if (typeof aVal === "string" && typeof bVal === "string") {
      const res = aVal.localeCompare(bVal);
      return order === "asc" ? res : -res;
    }

    const aTime = new Date(aVal as Date).getTime();
    const bTime = new Date(bVal as Date).getTime();

    if (aTime < bTime) return order === "asc" ? -1 : 1;
    if (aTime > bTime) return order === "asc" ? 1 : -1;

    return 0;
  };

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();

    return list
      .filter(
        (r) =>
          r.fullName.toLowerCase().includes(q) ||
          r.codeMeli.toLowerCase().includes(q),
      )
      .sort(comparator);
  }, [list, query, orderBy, order]);
  
  const handleSuspend = (row: ReceptionRow) => {
    console.log("Suspend:", row.id);
  };

  return (
    <Paper sx={{ mt: 2, p: 2, display: "grid", gap: 2 }}>
      {selectedVisit && (
        <MedicineDialog
          visitId={selectedVisit}
          open={open}
          setOpen={setOpen}
        />
      )}

      <TextField
        label="جستجو بر اساس نام یا کد ملی"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
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
                  تاریخ ورود
                </TableSortLabel>
              </TableCell>

              <TableCell>ورود به مطب</TableCell>
              <TableCell>خروج از مطب</TableCell>
              <TableCell>عملیات</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.fullName}</TableCell>
                <TableCell>{row.codeMeli}</TableCell>

                <TableCell>
                  {tehranTimezone(row.receptionTime.toISOString())}
                </TableCell>

                <TableCell>
                  {row.treatTime ? tehranTimezone(row.treatTime.toISOString()) : "--"}
                </TableCell>

                <TableCell>
                  {row.exitRoomAt ? tehranTimezone(row.exitRoomAt.toISOString()) : "--"}
                </TableCell>

                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setSelectedVisit(row.id);
                      setOpen(true);
                    }}
                    disabled={row.status === "suspend"}
                    sx={{ mr: 1 }}
                  >
                    دارو ها
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    onClick={() => handleSuspend(row)}
                    disabled={row.status === "suspend"}
                  >
                    تعلیق
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
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
