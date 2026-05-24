'use client'
import { TextField } from "@mui/material";

type EditableCellProps = {
  value: any;
  onChange: (value: string) => void;
  type?: "text" | "number";
};

export const EditableCell = ({
  value,
  onChange,
  type = "text",
}: EditableCellProps) => {
  return (
    <TextField
      size="small"
      type={type}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      slotProps={
        type === "number"
          ? {
              htmlInput: { type: "number", min: 1 },
            }
          : undefined
      }
    />
  );
};
