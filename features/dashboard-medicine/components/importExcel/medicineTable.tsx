// components/MedicineTable.tsx
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

export const MedicineTable = ({
  rows,
  allSelected,
  onSelectAll,
  onSelectRow,
  onEditCell,
}: MedicineTableProps) => {
  return (
    <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox checked={allSelected} onChange={onSelectAll} />
            </TableCell>
            <TableCell>نام دارو</TableCell>
            <TableCell>فرم</TableCell>
            <TableCell>وضعیت دارو</TableCell>
            <TableCell>وضعیت شارژ</TableCell>
            <TableCell>تعداد شارژ</TableCell>
            <TableCell>تاریخ انقضا</TableCell>
            <TableCell>محل نگهداری</TableCell>
            <TableCell>خطاها</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <MedicineTableRow
              key={row.id}
              row={row}
              onSelect={() => onSelectRow(row.id)}
              onEdit={(field, value) => onEditCell(row.id, field, value)}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
