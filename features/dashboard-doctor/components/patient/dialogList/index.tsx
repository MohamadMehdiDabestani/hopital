"use client";
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  FormControlLabel,
  Checkbox,
  TextField,
  Box,
  Button,
} from "@mui/material";
import { useMemo, useState } from "react";
type Item = {
  id: number;
  name: string;
};
type DialogListProps<T extends Item> = {
  open: boolean;
  setOpen: (open: boolean) => void;
  list: T[];
  selected?: T[];
  toggle: (item:T) => void;
};
export const DialogList = <T extends Item>({
  open,
  setOpen,
  list,
  toggle,
  selected,
}: DialogListProps<T>) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((d) => d.name.toLowerCase().includes(q));
  }, [query]);

  const isSelected = (drugId: number) =>
    selected?.some((d: any) => d.id === drugId);

  const toggleSelect = (item: T) => {
    toggle(item);
    // if (isSelected(item.id)) {
    //   helpers.setValue(selected.filter((d: any) => d.id !== drug.id));
    // } else {
    //   helpers.setValue([
    //     ...selected,
    //     { id: drug.id, intervalHours: undefined, daysPerWeek: undefined, note: undefined },
    //   ]);
    // }
  };
  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
      <DialogTitle>آیتم مورد نظر را انتخاب کنید</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="جستجو"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {filtered.map((d) => {
            const checked = isSelected(d.id);
            return (
              <FormControlLabel
                key={d.id}
                control={
                  <Checkbox
                    size="small"
                    checked={checked}
                    onChange={() => toggleSelect(d)}
                  />
                }
                label={d.name}
                sx={{
                  m: 0,
                  pr: 1,
                  borderRadius: 1,
                  bgcolor: "action.hover",
                }}
              />
            );
          })}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>بستن</Button>
      </DialogActions>
    </Dialog>
  );
};
