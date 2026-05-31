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
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { tehranTimezone } from "@/features/core";
import useSWR from "swr";
import { statusColor, statusFa } from "@/features/dasboard-admision/const";
import { makeSuspendAction } from "@/features/dasboard-admision/actions";
import { useVisitsRealtime } from "@/features/dasboard-admision/hooks/useVisitsRealtime";

type ReceptionRow = {
  id: number;
  fullName: string;
  codeMeli: string;
  receptionTime: string; // ISO
  treatTime: string | null; // ISO
  exitRoomAt: string | null;
  status: string;
};

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
  | { type: "UPDATE"; payload: ReceptionRow };

const rowsReducer = (state: ReceptionRow[], action: Action) => {
  switch (action.type) {
    case "ADD":
      return [action.payload, ...state];
    case "SET":
      return action.payload;
    case "UPDATE":
      return state.map((r) =>
        r.id === action.payload.id ? { ...r, ...action.payload } : r,
      );

    default:
      return state;
  }
};
const normalize = (v: string | null | number) => {
  if (v === null) return -Infinity;
  return typeof v === "string" ? new Date(v).getTime() : v;
};

export const ReceptionTable = () => {
  const [query, setQuery] = useState("");
  const [orderBy, setOrderBy] = useState<SortKey>("receptionTime");
  const [order, setOrder] = useState<Order>("desc");
  const [rows, dispatch] = useReducer(rowsReducer, []);

  const { data, isLoading } = useSWR("/api/dashboard/admision/queue");

  useEffect(() => {
    if (data) {
      dispatch({ type: "SET", payload: data.rows });
    }
  }, [data]);
  const handleRealtimeChange = useCallback((payload: any) => {
    if (payload?.op === "UPDATE") {
      dispatch({ type: "UPDATE", payload });
    } else if (payload?.op === "INSERT") {
      dispatch({ type: "ADD", payload });
    }
  }, []);
  useVisitsRealtime({
    enabled: true,
    onConnected: () => console.log("realtime connected"),
    onDisconnected: () => console.log("realtime disconnected"),
    onChange: handleRealtimeChange,
  });

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(
      (r) =>
        r.fullName.toLowerCase().includes(q) ||
        r.codeMeli.toLowerCase().includes(q),
    );
  }, [query, rows]);

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

  const handleSort = (key: SortKey) => {
    if (orderBy === key) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setOrderBy(key);
      setOrder("asc");
    }
  };

  const handleSuspend = async (row: ReceptionRow) => {
    await makeSuspendAction(row.id);
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
                <TableCell>{tehranTimezone(row.receptionTime)}</TableCell>
                <TableCell>
                  {row.treatTime ? tehranTimezone(row.treatTime) : "--"}
                </TableCell>
                <TableCell>
                  {row.exitRoomAt ? tehranTimezone(row.exitRoomAt) : "--"}
                </TableCell>
                <TableCell>
                  <Chip
                    label={statusFa[row.status]}
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

            {sortedRows.length === 0 && !isLoading && (
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
