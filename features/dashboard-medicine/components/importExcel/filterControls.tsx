import { FormControlLabel, Checkbox, Box } from "@mui/material";
import {Fragment} from 'react'
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
    <Fragment>
      <FormControlLabel
        control={
          <Checkbox
            checked={showOnlyEmpty}
            onChange={(e) => onToggleEmpty(e.target.checked)}
          />
        }
        label="نمایش ردیف ها ی دارای حداقل یک ستون خالی"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={showOnlyErrors}
            onChange={(e) => onToggleErrors(e.target.checked)}
          />
        }
        label="نمایش ردیف های دارای حداقل یک اخطار"
      />
    </Fragment>
  );
};
