"use client";

import {
  Box,
  Button,
  Divider,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { GridToolbar, GridToolbarProps } from "@mui/x-data-grid/internals";
import { exportGridToExcel } from "@/features/core/utils/gridToExcel";
import { DateTimeTrigger } from "@/features/dashboard-medicine/type";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "@/features/core/utils/dayjs";
import { useMemo, useState } from "react";
import { PickerValue } from "@mui/x-date-pickers/internals";
import RefreshIcon from "@mui/icons-material/Refresh";
type Props = GridToolbarProps & {
  dateTimeTrigger: DateTimeTrigger;
  onChangeDateTime: (value: DateTimeTrigger) => void;
  rows: any[];
  columns: any[];
  setFromDateTime: (value: PickerValue) => void;
  setToDateTime: (value: PickerValue) => void;
  fromDateTime: dayjs.Dayjs | null;
  toDateTime: dayjs.Dayjs | null;
};

export const AdmisionHistoryToolbar = ({
  columns,
  dateTimeTrigger,
  onChangeDateTime,
  rows,
  fromDateTime,
  toDateTime,
  setFromDateTime,
  setToDateTime,
  ...props
}: Props) => {
  const today = useMemo(() => dayjs().calendar("jalali"), []);
  const resetDateTime = () => {
    setFromDateTime(null);
    setToDateTime(null);
  };
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
        flexWrap: "wrap",
        gap: 1,
        p: 1,
      }}
    >
      <GridToolbar {...props} />
      <DateTimePicker
        label="از تاریخ"
        value={fromDateTime ?? today} // for handle initial jalali format
        maxDateTime={toDateTime ? toDateTime : today}
        onChange={(newValue) =>
          setFromDateTime(dayjs(newValue).calendar("jalali"))
        }
        ampm={false}
        format="HH:mm YYYY/MM/DD"
        slotProps={{
          textField: {
            variant: "filled",
          },
        }}
      />
      <DateTimePicker
        label="تا تاریخ"
        value={toDateTime ?? today} // for handle initial jalali format
        maxDateTime={today}
        format="HH:mm YYYY/MM/DD"
        onChange={(newValue) =>
          setToDateTime(dayjs(newValue).calendar("jalali"))
        }
        ampm={false}
        slotProps={{
          textField: {
            variant: "filled",
          },
        }}
      />
      <IconButton onClick={resetDateTime}>
        <RefreshIcon />
      </IconButton>
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
            fileName: "admision.xlsx",
            sheetName: "Admision",
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
