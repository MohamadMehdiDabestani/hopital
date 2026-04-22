import {
  Autocomplete,
  TextField,
} from "@mui/material";
import { ReactNode } from "react";

type PickerProps<T> = {
  options: T[];
  value: T | null;
  onChange: (value: T | null) => void;

  getOptionLabel: (option: T) => string;
  groupBy?: (option: T) => string;
  isOptionEqualToValue?: (a: T, b: T) => boolean;

  renderOption?: (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: T
  ) => ReactNode;

  loading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  helperText?: ReactNode;
  error?: boolean;
  label?: string;
};

export const  AutoCompleteG = <T,>({
  options,
  value,
  onChange,
  getOptionLabel,
  groupBy,
  isOptionEqualToValue,
  renderOption,
  loading = false,
  disabled = false,
  placeholder = "انتخاب...",
  helperText,
  error = false,
  label = "انتخاب",
}: PickerProps<T>) => {
  return (
    <Autocomplete
      fullWidth
      disablePortal
      clearOnEscape
      autoHighlight
      disabled={disabled}
      loading={loading}
      options={options}
      value={value}
      groupBy={groupBy}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      onChange={(_, v) => onChange(v)}
      renderOption={renderOption}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          helperText={helperText}
          error={error}
          placeholder={placeholder}
        />
      )}
    />
  );
}
