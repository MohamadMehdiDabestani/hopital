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

import { useCallback, useEffect, useMemo, useState } from "react";
import { tehranTimezone } from "@/features/core";
import { MedicineDialog } from "./medicineDialog";
import { useVisitsRealtime } from "@/features/core/hooks/useVisitsRealtime";

type ReceptionRow = {
  id: number;
  fullName: string;
  codeMeli: string;
  receptionTime: string;
  treatTime: string | null;
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

type Props = {
  list: ReceptionRow[];
};

export const DashboardMedicineQueue = ({ list }: Props) => {
  const [rowMap, setRowMap] = useState<Map<number, ReceptionRow>>(
    () => new Map(list.map((r) => [r.id, r])),
  );

  const [query, setQuery] = useState("");
  const [orderBy, setOrderBy] = useState<SortKey>("receptionTime");
  const [order, setOrder] = useState<Order>("desc");
  const [open, setOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<number | null>(null);

  useEffect(() => {
    setRowMap(new Map(list.map((r) => [r.id, r])));
  }, [list]);
  const handleRealtimeChange = useCallback((payload: any) => {
    setRowMap((prev) => {
      const next = new Map(prev);
      if (payload.status == "suspended" || payload.status == "finish")
        next.delete(payload.id);
      else if (payload.status == "reciveMedicine")
        next.set(payload.id, payload);
      return next;
    });
  }, []);
  // for auto change if list is empty
  useVisitsRealtime({
    enabled: true,
    onConnected: () => console.log("realtime connected"),
    onDisconnected: () => console.log("realtime disconnected"),
    onChange: handleRealtimeChange,
  });

  const compare = (a: ReceptionRow, b: ReceptionRow) => {
    const aVal = a[orderBy];
    const bVal = b[orderBy];

    if (!aVal) return 1;
    if (!bVal) return -1;

    if (typeof aVal === "string") {
      const res = aVal.localeCompare(bVal as string);
      return order === "asc" ? res : -res;
    }

    const aTime = new Date(aVal).getTime();
    const bTime = new Date(bVal).getTime();

    return order === "asc" ? aTime - bTime : bTime - aTime;
  };

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();

    const arr = Array.from(rowMap.values()).filter(
      (r) =>
        r.fullName.toLowerCase().includes(q) ||
        r.codeMeli.toLowerCase().includes(q),
    );

    return arr.sort(compare);
  }, [rowMap, query, orderBy, order]);

  const renderSort = (key: SortKey, label: string) => (
    <TableCell sortDirection={orderBy === key ? order : false}>
      <TableSortLabel
        active={orderBy === key}
        direction={orderBy === key ? order : "asc"}
        onClick={() =>
          setOrderBy((prev) => {
            if (prev === key) {
              setOrder((o) => (o === "asc" ? "desc" : "asc"));
              return prev;
            }
            setOrder("asc");
            return key;
          })
        }
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );

  return (
    <Paper sx={{ mt: 2, p: 2, display: "grid", gap: 2 }}>
      {selectedVisit && (
        <MedicineDialog visitId={selectedVisit} open={open} setOpen={setOpen} />
      )}

      <TextField
        label="جستجو بر اساس نام یا کد ملی"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <TableContainer
        sx={(t) => ({ border: `1px solid ${t.palette.grey.A200}` })}
      >
        <Table>
          <TableHead>
            <TableRow>
              {renderSort("fullName", "نام و نام خانوادگی")}
              {renderSort("codeMeli", "کد ملی")}
              {renderSort("receptionTime", "تاریخ ورود")}
              <TableCell>ورود به مطب</TableCell>
              <TableCell>خروج از مطب</TableCell>
              <TableCell>عملیات</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  نتیجه‌ای پیدا نشد
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
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
                      disabled={row.status === "suspend"}
                      onClick={() => {
                        setSelectedVisit(row.id);
                        setOpen(true);
                      }}
                    >
                      دارو ها
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
