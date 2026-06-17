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
  onAddUser: () => void;
  dateTimeTrigger: DateTimeTrigger;
  onChangeDateTime: (value: DateTimeTrigger) => void;
  rows: any;
  columns:any
};

export const ManagerToolbar = ({
  onAddUser,
  dateTimeTrigger,
  onChangeDateTime,
  rows,
  columns,
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
      <Divider orientation="vertical" />
      <Button data-testid="openUserDialog"  variant="contained" sx={{ ml: 2, mr: 2 }} onClick={onAddUser}>
        افزودن کاربر جدید
      </Button>
      <Divider orientation="vertical" />
      

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
            fileName: "users.xlsx",
            sheetName: "Users",
            columnFilter: (c) => !['id','actions','fullName'].includes(c.field)
          });
        }}
      >
        خروجی اکسل
      </Button>
    </Box>
  );
};
