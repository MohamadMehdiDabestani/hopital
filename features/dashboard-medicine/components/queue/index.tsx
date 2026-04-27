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
import { useMemo, useReducer, useState } from "react";
import { tehranTimezone } from "@/features/core";
import { MedicineDialog } from "./medicineDialog";
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
  visitId: number
};

const initial: ReceptionRow[] = [
  {
    id: 1,
    fullName: "علی رضایی",
    codeMeli: "1234567890",
    receptionTime: "2026-04-22T08:15:00Z",
    treatTime: null,
    exitRoomAt: null,
    status: "در انتظار",
    visitId : 1,
  },
  {
    id: 2,
    fullName: "زهرا کاظمی",
    codeMeli: "0987654321",
    receptionTime: "2026-04-22T09:05:00Z",
    treatTime: "2026-04-22T09:05:00Z",
    status: "داخل مطب",
    exitRoomAt: null,
    visitId : 2,
  },

];

type Order = "asc" | "desc";
type SortKey =
  | "fullName"
  | "codeMeli"
  | "receptionTime"
  | "treatTime"
  | "exitRoomAt";

type Action =
  | { type: "ADD"; payload: ReceptionRow }
  | { type: "SET"; payload: ReceptionRow[] }
  | { type: "UPDATE"; payload: ReceptionRow }
  | { type: "REMOVE"; payload: number };
const rowsReducer = (state: ReceptionRow[], action: Action) => {
  switch (action.type) {
    case "ADD":
      console.log([action.payload, ...state]);
      return [action.payload, ...state];
    case "SET":
      return action.payload;
    case "UPDATE":
      return state.map((r) =>
        r.id === action.payload.id ? action.payload : r,
      );
    case "REMOVE":
      return state.filter((r) => r.id !== action.payload);
    default:
      return state;
  }
};
export const DashboardMedicineQueue = () => {
  const [query, setQuery] = useState("");
  const [orderBy, setOrderBy] = useState<SortKey>("receptionTime");
  const [order, setOrder] = useState<Order>("desc");
  const [open , setOpen] = useState<boolean>(false);
  const [selectedVisit , setSelectedVisit] = useState<number>(0)
  const handleSort = (key: SortKey) => {
    if (orderBy === key) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setOrderBy(key);
      setOrder("asc");
    }
  };
  const [rows, dispatch] = useReducer(rowsReducer, initial);
  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(
      (r) =>
        r.fullName.toLowerCase().includes(q) ||
        r.codeMeli.toLowerCase().includes(q),
    );
  }, [query, rows]);
  const normalize = (v: string | null | number) => {
    if (v === null) return -Infinity;
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
      <MedicineDialog visitId={selectedVisit} open={open} setOpen={setOpen} />
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

              <TableCell>عملیات</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.fullName}</TableCell>
                <TableCell>{row.codeMeli}</TableCell>
                <TableCell>{tehranTimezone(row.receptionTime)}</TableCell>
                <TableCell>
                  {row.treatTime ? tehranTimezone(row.treatTime) : "--"}
                </TableCell>
                <TableCell>
                  {row.exitRoomAt ? tehranTimezone(row.exitRoomAt) : "--"}
                </TableCell>

                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setOpen(true)
                      setSelectedVisit(row.visitId)
                    }}
                    disabled={row.status === "تعلیق"}
                    sx={{
                      mr: 1,
                    }}
                  >
                    دارو ها
                  </Button>
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
