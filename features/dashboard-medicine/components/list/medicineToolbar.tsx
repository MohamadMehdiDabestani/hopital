"use client";

import { Box, Button, Checkbox, FormControlLabel } from "@mui/material";
import { GridToolbar, GridToolbarProps } from "@mui/x-data-grid/internals";

type Props = GridToolbarProps & {
  showExpired: boolean;
  onToggleExpired: (checked: boolean) => void;
  onAddMedicine: () => void;
};

export const MedicineListToolbar = ({
  showExpired,
  onToggleExpired,
  onAddMedicine,
  ...props
}: Props) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
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

      <Button
        variant="contained"
        sx={{ ml: 2 }}
        onClick={onAddMedicine}
      >
        افزودن دارو جدید
      </Button>
    </Box>
  );
};
