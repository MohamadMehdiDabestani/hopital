import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

type ParaclinicItem = {
  id: number;
  name: string;
  category: "آزمایش" | "تصویربرداری" | "قلب و عروق" | "سایر";
};

const PARACLINIC_ITEMS: ParaclinicItem[] = [
  // آزمایش‌ها
  { id: 1, name: "CBC", category: "آزمایش" },
  { id: 2, name: "FBS", category: "آزمایش" },
  { id: 3, name: "HbA1c", category: "آزمایش" },
  { id: 4, name: "BUN / Cr", category: "آزمایش" },
  { id: 5, name: "LFT", category: "آزمایش" },
  { id: 6, name: "Lipid Profile", category: "آزمایش" },
  { id: 7, name: "CRP", category: "آزمایش" },
  { id: 8, name: "ESR", category: "آزمایش" },
  { id: 9, name: "TSH", category: "آزمایش" },
  { id: 10, name: "UA/UC", category: "آزمایش" },

  // تصویربرداری
  { id: 11, name: "رادیوگرافی ساده", category: "تصویربرداری" },
  { id: 12, name: "سونوگرافی شکم", category: "تصویربرداری" },
  { id: 13, name: "سونوگرافی لگن", category: "تصویربرداری" },
  { id: 14, name: "CT Scan", category: "تصویربرداری" },
  { id: 15, name: "MRI", category: "تصویربرداری" },

  // قلب و عروق
  { id: 16, name: "ECG", category: "قلب و عروق" },
  { id: 17, name: "ECHO", category: "قلب و عروق" },
  { id: 18, name: "تست ورزش", category: "قلب و عروق" },

  // سایر
  { id: 19, name: "نوار عصب و عضله (EMG/NCV)", category: "سایر" },
  { id: 20, name: "تست بینایی‌سنجی", category: "سایر" },
];

const ParaclinicPickerModal = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ParaclinicItem[]>([]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PARACLINIC_ITEMS;
    return PARACLINIC_ITEMS.filter((i) => i.name.toLowerCase().includes(q));
  }, [query]);

  const toggle = (item: ParaclinicItem) => {
    const exists = selected.some((s) => s.id === item.id);
    if (exists) setSelected(selected.filter((s) => s.id !== item.id));
    else setSelected([...selected, item]);
  };

  return (
    <Card>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>انتخاب آزمایش</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="جستجوی دارو"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* چک‌لیست با اندازه‌ی خودکار برای هر مورد */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {filtered.map((d) => {
              const checked = selected.some((x) => x.id === d.id);
              return (
                <FormControlLabel
                  key={d.id}
                  control={
                    <Checkbox
                      size="small"
                      checked={checked}
                      onChange={() => toggle(d)}
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
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">بخش آزمایش</Typography>
          <Button color="info" variant="outlined" onClick={() => setOpen(true)}>
            نمایش آزمایشات
          </Button>
        </Box>
        <Divider sx={{ my: 1 }} />

        {/* تنظیمات هر دارو */}
        <Box sx={{ mt: 2 }}>
          {selected.length === 0 ? (
            <Typography color="text.secondary">
              هنوز دارویی انتخاب نشده است.
            </Typography>
          ) : (
            selected.map((p) => (
              <Chip sx={{mx:1}} key={p.id} label={p.name} onDelete={() => toggle(p)} />
            ))
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ParaclinicPickerModal;
