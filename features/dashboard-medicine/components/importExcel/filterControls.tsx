import { FormControlLabel, Checkbox, Box } from "@mui/material";

type FilterControlsProps = {
  showOnlyEmpty: boolean;
  showOnlyErrors: boolean;
  onToggleEmpty: (checked: boolean) => void;
  onToggleErrors: (checked: boolean) => void;
};

export const FilterControls = ({
  showOnlyEmpty,
  showOnlyErrors,
  onToggleEmpty,
  onToggleErrors,
}: FilterControlsProps) => {
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={showOnlyEmpty}
            onChange={(e) => onToggleEmpty(e.target.checked)}
          />
        }
        label="نمایش فقط ردیف‌های دارای مقدار خالی"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={showOnlyErrors}
            onChange={(e) => onToggleErrors(e.target.checked)}
          />
        }
        label="نمایش فقط ردیف‌های دارای خطا"
      />
    </Box>
  );
};
