import { memo } from "react";
import {
  TableRow,
  TableCell,
  Checkbox,
  Typography,
  type SxProps,
  type Theme,
} from "@mui/material";
import { SelectCell, EditableCell } from "@/features/core";
import {
  ImportExcelRoleOption,
  ImportExcelSuspendedOption,
} from "@/features/dashboard-manager/const";
import type { ImportExcelParsedRow } from "@/features/dashboard-medicine/type";

type UserTableRowProps = {
  row: ImportExcelParsedRow;
  onSelect: (id: string) => void; 
  onEdit: (id: string, field: string, value: any) => void; 
  style?: React.CSSProperties;
};

export const UserTableRow = memo(
  ({ row, onSelect, onEdit, style }: UserTableRowProps) => {
    return (
      <TableRow
        sx={{
          display: "flex",
          alignItems: "stretch",
          width: "100%",
          boxSizing: "border-box",
        }}
        style={style}
      >
        <TableCell
          padding="checkbox"
          sx={{
            flex: "0 0 50px",
            position: "sticky",
            left: 0,
            zIndex: 1,
            bgcolor: "background.paper",
          }}
        >
          <Checkbox
            checked={row.selected}
            onChange={() => onSelect(row.id)}
            disabled={!row.isValid}
          />
        </TableCell>
        <TableCell sx={{ flex: "1 0 120px", py: 1.5 }}>
          <EditableCell
            value={row.data.firstName}
            onChange={(v) => onEdit(row.id, "firstName", v)}
          />
        </TableCell>
        <TableCell sx={{ flex: "1 0 150px", py: 1.5 }}>
          <EditableCell
            value={row.data.lastName}
            onChange={(v) => onEdit(row.id, "lastName", v)}
          />
        </TableCell>
        <TableCell sx={{ flex: "1 0 120px", py: 1.5 }}>
          <EditableCell
            value={row.data.codeMeli}
            onChange={(v) => onEdit(row.id, "codeMeli", v)}
          />
        </TableCell>
        <TableCell sx={{ flex: "1 0 130px", py: 1.5 }}>
          <EditableCell
            value={row.data.phoneNumber}
            onChange={(v) => onEdit(row.id, "phoneNumber", v)}
          />
        </TableCell>
        <TableCell sx={{ flex: "1 0 100px", py: 1.5 }}>
          <SelectCell
            label="نقش"
            value={row.data.role}
            options={ImportExcelRoleOption}
            onChange={(v) => onEdit(row.id, "role", v)}
          />
        </TableCell>
        <TableCell sx={{ flex: "1 0 100px", py: 1.5 }}>
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
            onChange={(v) => onEdit(row.id, "suspended", v === 1)}
          />
        </TableCell>
        <TableCell sx={{ flex: "1 0 200px", py: 1.5 }}>
          {row.validationError && (
            <Typography variant="caption" color="error">
              {row.validationError}
            </Typography>
          )}
        </TableCell>
      </TableRow>
    );
  },
);

UserTableRow.displayName = "UserTableRow";
