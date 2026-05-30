import { memo } from "react";
import { TableRow, TableCell, Checkbox, Typography } from "@mui/material";
import { EditableCell, SelectCell } from "@/features/core";
import {
  ImportExcelFormOption,
  ImportExcelStatusOption,
} from "@/features/dashboard-medicine/const";
import type { ImportExcelParsedRow } from "@/features/dashboard-medicine/type";

type MedicineTableRowProps = {
  row: ImportExcelParsedRow;
  onSelect: (id: string) => void;
  onEdit: (id: string, field: string, value: any) => void;
  style?: React.CSSProperties;
};

export const MedicineTableRow = memo(
  ({ row, onSelect, onEdit, style }: MedicineTableRowProps) => {
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
        <TableCell sx={{ flex: "1 0 140px", py: 1.5 }}>
          <EditableCell
            value={row.data.name}
            onChange={(value) => onEdit(row.id, "name", value)}
          />
        </TableCell>
        <TableCell sx={{ flex: "1 0 100px", py: 1.5 }}>
          <SelectCell
            label="فرم دارو"
            value={row.data.form}
            options={ImportExcelFormOption}
            onChange={(value) => onEdit(row.id, "form", value)}
          />
        </TableCell>
        <TableCell sx={{ flex: "1 0 100px", py: 1.5 }}>
          <SelectCell
            label="وضعیت"
            value={
              row.data.isActive === true
                ? 1
                : row.data.isActive === false
                  ? 0
                  : undefined
            }
            options={ImportExcelStatusOption}
            onChange={(value) => onEdit(row.id, "isActive", value === 1)}
          />
        </TableCell>
        {/* <TableCell sx={{ flex: "1 0 100px", py: 1.5 }}>
          <SelectCell
            label="وضعیت شارژ"
            value={row.data.chargeIsActive}
            options={ImportExcelStatusOption}
            onChange={(value) => onEdit(row.id, "chargeIsActive", value)}
          />
        </TableCell> */}
        <TableCell sx={{ flex: "1 0 90px", py: 1.5 }}>
          <EditableCell
            type="number"
            value={row.data.chargeQuantity}
            onChange={(value) => onEdit(row.id, "chargeQuantity", value)}
          />
        </TableCell>
        <TableCell sx={{ flex: "1 0 120px", py: 1.5 }}>
          <EditableCell
            value={row.data.chargeExpiryDate}
            onChange={(value) => onEdit(row.id, "chargeExpiryDate", value)}
          />
        </TableCell>
        <TableCell sx={{ flex: "1 0 120px", py: 1.5 }}>
          <EditableCell
            value={row.data.chargeStorageLocation}
            onChange={(value) => onEdit(row.id, "chargeStorageLocation", value)}
          />
        </TableCell>
        <TableCell sx={{ flex: "1 0 180px", py: 1.5 }}>
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

MedicineTableRow.displayName = "MedicineTableRow";
