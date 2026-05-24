// components/MedicineTableRow.tsx
import { TableRow, TableCell, Checkbox, Typography } from "@mui/material";
import { SelectCell,EditableCell } from "@/features/core";
import { ImportExcelRoleOption, ImportExcelSuspendedOption } from "@/features/dashboard-manager/const";
import type { ImportExcelParsedRow } from "@/features/dashboard-medicine/type";
import { ImportExcelStatusOption } from "@/features/dashboard-medicine/const";

type UserTableRowProps = {
  row: ImportExcelParsedRow;
  onSelect: () => void;
  onEdit: (field: string, value: any) => void;
};

export const UserTableRow = ({ row, onSelect, onEdit }: UserTableRowProps) => {
  return (
    <TableRow key={row.id}>
      <TableCell padding="checkbox">
        <Checkbox
          checked={row.selected}
          onChange={onSelect}
          disabled={!row.isValid}
        />
      </TableCell>
      <TableCell>
        <EditableCell
          value={row.data.firstName}
          onChange={(value) => onEdit("firstName", value)}
        />
      </TableCell>
      <TableCell>
        <EditableCell
          value={row.data.lastName}
          onChange={(value) => onEdit("lastName", value)}
        />
      </TableCell>
      <TableCell>
        <EditableCell
          value={row.data.codeMeli}
          onChange={(value) => onEdit("codeMeli", value)}
        />
      </TableCell>
      <TableCell>
        <EditableCell
          value={row.data.phoneNumber}
          onChange={(value) => onEdit("phoneNumber", value)}
        />
      </TableCell>
      <TableCell>
        <SelectCell
          label="نقش"
          value={row.data.role}
          options={ImportExcelRoleOption}
          onChange={(value) => onEdit("role", value)}
        />
      </TableCell>
      <TableCell>
        <SelectCell
          label="وضعیت"
          value={
            row.data.suspended === true
              ? 1
              : row.data.suspended === false
                ? 0
                : undefined
          }
          options={ImportExcelSuspendedOption}
          onChange={(value) => {
            onEdit("suspended", value === 1);
          }}
        />
      </TableCell>
      <TableCell>
        {row.validationError && (
          <Typography variant="caption" color="error">
            {row.validationError}
          </Typography>
        )}
      </TableCell>
    </TableRow>
  );
};
