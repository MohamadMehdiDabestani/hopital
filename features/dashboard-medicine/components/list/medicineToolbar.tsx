"use client";

import { Box, Button, Checkbox, FormControlLabel } from "@mui/material";
import { GridToolbar, GridToolbarProps } from "@mui/x-data-grid/internals";
import { exportGridToExcel } from "@/features/core/utils/gridToExcel";
import { medicineExcelColumns } from "../../utils/flattenColumn";
import { flattenMedicineRowsForExcel } from "../../utils/flattendRow";
import { Row } from "../../type";
type Props = GridToolbarProps & {
  showExpired: boolean;
  onToggleExpired: (checked: boolean) => void;
  onAddMedicine: () => void;
  rows: any;
  baseToday: any;
};

export const MedicineListToolbar = ({
  showExpired,
  onToggleExpired,
  onAddMedicine,
  rows,
  baseToday,
  ...props
}: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        borderBottom: "1px solid",
        borderBottomColor: "divider",
        "&>div" : {
          borderBottom : "none"
        }
      }}
    >
      <GridToolbar {...props} />

      <FormControlLabel
        sx={{ ml: 2 }}
        control={
          <Checkbox
            checked={showExpired}
            onChange={(e) => onToggleExpired(e.target.checked)}
            color="error"
          />
        }
        label="دارو های دارای هشدار انقضا"
      />

      <Button variant="contained" sx={{ ml: 2 }} onClick={onAddMedicine}>
        افزودن دارو جدید
      </Button>
      <Button
        color="warning"
        sx={{ ml: 2 }}
        variant="contained"
        onClick={() => {
          exportGridToExcel(rows ?? [], medicineExcelColumns, {
            fileName: "medicines.xlsx",
            sheetName: "Medicines",
            transformRows: (rows) =>
              flattenMedicineRowsForExcel(rows as Row[], baseToday),
            columnFilter: (c) => c.field !== "id",
          });
        }}
      >
        خروجی اکسل
      </Button>
    </Box>
  );
};
