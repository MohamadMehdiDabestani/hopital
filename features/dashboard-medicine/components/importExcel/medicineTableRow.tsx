// components/MedicineTableRow.tsx
import { TableRow, TableCell, Checkbox, Typography } from "@mui/material";
import { EditableCell } from "./editableCell";
import { SelectCell } from "./selectCell";
import {
  ImportExcelFormOption,
  ImportExcelStatusOption,
} from "@/features/dashboard-medicine/const";
import type { ImportExcelParsedRow } from "@/features/dashboard-medicine/type";

type MedicineTableRowProps = {
  row: ImportExcelParsedRow;
  onSelect: () => void;
  onEdit: (field: string, value: any) => void;
};

export const MedicineTableRow = ({
  row,
  onSelect,
  onEdit,
}: MedicineTableRowProps) => {
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
          value={row.data.name}
          onChange={(value) => onEdit("name", value)}
        />
      </TableCell>
      <TableCell>
        <SelectCell
          label="فرم دارو"
          value={row.data.form}
          options={ImportExcelFormOption}
          onChange={(value) => onEdit("form", value)}
        />
      </TableCell>
      <TableCell>
        <SelectCell
          label="وضعیت"
          value={row.data.isActive}
          options={ImportExcelStatusOption}
          onChange={(value) => onEdit("isActive", value)}
        />
      </TableCell>
      <TableCell>
        <SelectCell
          label="وضعیت شارژ"
          value={row.data.chargeIsActive}
          options={ImportExcelStatusOption}
          onChange={(value) => onEdit("chargeIsActive", value)}
        />
      </TableCell>
      <TableCell>
        <EditableCell
          type="number"
          value={row.data.chargeQuantity}
          onChange={(value) => onEdit("chargeQuantity", value)}
        />
      </TableCell>
      <TableCell>
        <EditableCell
          value={row.data.chargeExpiryDate}
          onChange={(value) => onEdit("chargeExpiryDate", value)}
        />
      </TableCell>
      <TableCell>
        <EditableCell
          value={row.data.chargeStorageLocation}
          onChange={(value) => onEdit("chargeStorageLocation", value)}
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
