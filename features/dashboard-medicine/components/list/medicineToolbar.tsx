"use client";

import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { GridToolbar, GridToolbarProps } from "@mui/x-data-grid/internals";
import { exportGridToExcel } from "@/features/core/utils/gridToExcel";
import { medicineExcelColumns } from "../../utils/flattenColumn";
import { flattenMedicineRowsForExcel } from "../../utils/flattendRow";
import { DateTimeTrigger, Row } from "../../type";

type Props = GridToolbarProps & {
  showExpired: boolean;
  onToggleExpired: (checked: boolean) => void;
  onAddMedicine: () => void;
  dateTimeTrigger: DateTimeTrigger;
  onChangeDateTime: (value: DateTimeTrigger) => void;
  rows: any;
  baseToday: any;
};

export const MedicineListToolbar = ({
  showExpired,
  onToggleExpired,
  onAddMedicine,
  dateTimeTrigger,
  onChangeDateTime,
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
        "&>div": {
          borderBottom: "none",
        },
      }}
    >
      <GridToolbar {...props} />
      <Divider orientation="vertical"  />
      <Button variant="contained" sx={{ ml: 2 , mr:2 }} onClick={onAddMedicine}>
        افزودن دارو جدید
      </Button>
      <Divider orientation="vertical"  />
      <FormControlLabel
        sx={{ ml: 1 }}
        control={
          <Checkbox
            checked={showExpired}
            onChange={(e) => onToggleExpired(e.target.checked)}
            color="error"
          />
        }
        label="دارو های دارای هشدار انقضا"
      />

      <ToggleButtonGroup
        value={dateTimeTrigger}
        color="info"
        exclusive
        onChange={(_, value) => {
          if (value !== null) {
            onChangeDateTime(value);
          }
        }}
        size="small"
        
        sx={{ ml: 2 }}
      >
        <ToggleButton value="shamsi">شمسی</ToggleButton>
        <ToggleButton value="miladi">میلادی</ToggleButton>
      </ToggleButtonGroup>

      <Button
        color="warning"
        sx={{ ml: 2 }}
        variant="contained"
        onClick={() => {
          exportGridToExcel(rows ?? [], medicineExcelColumns, {
            fileName: "medicines.xlsx",
            sheetName: "Medicines",
            transformRows: (rows) =>
              flattenMedicineRowsForExcel(rows as Row[], baseToday , dateTimeTrigger),
            columnFilter: (c) => c.field !== "id",
          });
        }}
      >
        خروجی اکسل
      </Button>
    </Box>
  );
};
