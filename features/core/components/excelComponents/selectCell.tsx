'use client'
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

type SelectOption = {
  value: string | number; 
  label: string;
};

type SelectCellProps = {
  label: string;
  value: any;
  options: SelectOption[];
  onChange: (value: string | number) => void;
};

export const SelectCell = ({
  label,
  value,
  options,
  onChange,
}: SelectCellProps) => {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
