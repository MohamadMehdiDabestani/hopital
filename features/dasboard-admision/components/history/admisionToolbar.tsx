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
import { DateTimeTrigger } from "@/features/core";

type Props = GridToolbarProps & {
  dateTimeTrigger: DateTimeTrigger;
  onChangeDateTime: (value: DateTimeTrigger) => void;
  rows: any;
  columns: any;
};

export const AdmisionHistoryToolbar = ({
  columns,
  dateTimeTrigger,
  onChangeDateTime,
  rows,
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
          exportGridToExcel(rows ?? [], columns, {
            fileName: "medicines.xlsx",
            sheetName: "Medicines",
            // transformRows: (rows) =>
            //   flattenMedicineRowsForExcel(
            //     rows as Row[],
            //     baseToday,
            //     dateTimeTrigger,
            //   ),
            // columnFilter: (c) => c.field !== "id",
            columnFilter: (c) =>
              ![
                "id",
                "actions",
                "firstName",
                "lastName",
                "doctorFirstName",
                "doctorLastName",
              ].includes(c.field),
          });
        }}
      >
        خروجی اکسل
      </Button>
    </Box>
  );
};
