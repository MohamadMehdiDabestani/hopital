import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, memo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
} from "@mui/material";
import { MedicineTableRow } from "./medicineTableRow";
import type { ImportExcelParsedRow } from "@/features/dashboard-medicine/type";

type MedicineTableProps = {
  rows: ImportExcelParsedRow[];
  allSelected: boolean;
  onSelectAll: () => void;
  onSelectRow: (rowId: string) => void;
  onEditCell: (rowId: string, field: string, value: any) => void;
};

export const MedicineTable = memo(
  ({
    rows,
    allSelected,
    onSelectAll,
    onSelectRow,
    onEditCell,
  }: MedicineTableProps) => {
    const parentRef = useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualizer({
      count: rows.length,
      getScrollElement: () => parentRef.current,
      estimateSize: () => 80, // هماهنگ با ارتفاع ردیف
      overscan: 15,
    });

    // ✅ تثبیت مرجع توابع برای جلوگیری از re-render فرزند
    const handleSelectRow = useCallback(
      (id: string) => onSelectRow(id),
      [onSelectRow],
    );
    const handleEditCell = useCallback(
      (id: string, field: string, value: any) => onEditCell(id, field, value),
      [onEditCell],
    );

    const items = virtualizer.getVirtualItems();

    return (
      <TableContainer
        component={Paper}
        ref={parentRef}
        sx={{ maxHeight: 600, overflow: "auto", width: "100%" }}
      >
        <Table
          stickyHeader
          sx={{ width: "100%", tableLayout: "fixed", minWidth: 1200 }}
        >
          <TableHead>
            <TableRow
              sx={{ display: "flex", alignItems: "stretch", width: "100%" }}
            >
              <TableCell
                padding="checkbox"
                sx={{
                  flex: "0 0 50px",
                  position: "sticky",
                  left: 0,
                  zIndex: 2,
                  bgcolor: "background.paper",
                }}
              >
                <Checkbox checked={allSelected} onChange={onSelectAll} />
              </TableCell>
              <TableCell sx={{ flex: "1 0 140px" }}>نام دارو</TableCell>
              <TableCell sx={{ flex: "1 0 100px" }}>فرم</TableCell>
              <TableCell sx={{ flex: "1 0 100px" }}>وضعیت دارو</TableCell>
              {/* <TableCell sx={{ flex: "1 0 100px" }}>وضعیت شارژ</TableCell> */}
              <TableCell sx={{ flex: "1 0 90px" }}>تعداد شارژ</TableCell>
              <TableCell sx={{ flex: "1 0 120px" }}>تاریخ انقضا</TableCell>
              <TableCell sx={{ flex: "1 0 120px" }}>محل نگهداری</TableCell>
              <TableCell sx={{ flex: "1 0 180px" }}>خطاها</TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              position: "relative",
              height: `${virtualizer.getTotalSize()}px`,
              width: "100%",
            }}
          >
            {items.map((virtualRow) => {
              const row = rows[virtualRow.index];
              return (
                <MedicineTableRow
                  key={row.id}
                  row={row}
                  onSelect={handleSelectRow}
                  onEdit={handleEditCell}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    transform: `translateY(${virtualRow.start}px)`,
                    height: `${virtualRow.size}px`,
                  }}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  },
);

MedicineTable.displayName = "MedicineTable";
