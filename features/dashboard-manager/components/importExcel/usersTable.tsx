// components/OptimizedUsersTable.tsx
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, memo } from "react";
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
import { UserTableRow } from "./userTableRow";
import type { ImportExcelParsedRow } from "@/features/dashboard-medicine/type";

type UsersTableProps = {
  rows: ImportExcelParsedRow[];
  allSelected: boolean;
  onSelectAll: () => void;
  onSelectRow: (rowId: string) => void;
  onEditCell: (rowId: string, field: string, value: any) => void;
};

export const UsersTable = memo(({
  rows,
  allSelected,
  onSelectAll,
  onSelectRow,
  onEditCell,
}: UsersTableProps) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 53,
    overscan: 5,
  });

  const items = virtualizer.getVirtualItems();

  return (
    <TableContainer
      component={Paper}
      ref={parentRef}
      sx={{ maxHeight: 600, overflow: "auto" }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox checked={allSelected} onChange={onSelectAll} />
            </TableCell>
            <TableCell>نام</TableCell>
            <TableCell>نام خانوادگی</TableCell>
            <TableCell>کد ملی</TableCell>
            <TableCell>شماره موبایل</TableCell>
            <TableCell>نقش</TableCell>
            <TableCell>وضعیت</TableCell>
            <TableCell>خطاها</TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ height: `${virtualizer.getTotalSize()}px` }}>
          {items.map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <UserTableRow
                key={row.id}
                row={row}
                onSelect={() => onSelectRow(row.id)}
                onEdit={(field, value) => onEditCell(row.id, field, value)}
              />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

UsersTable.displayName = "UsersTable";
