import React, { useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  TextField,
  Typography,
  Stack,
  IconButton,
  Button,
  DialogActions,
  ListItemButton,
  ListItemText,
  List,
  DialogContent,
  DialogTitle,
  Dialog,
  FormControlLabel,
  Checkbox,
  Alert,
} from "@mui/material";
import WarningIcon from '@mui/icons-material/Warning'
import DeleteIcon from "@mui/icons-material/Delete";

type Drug = {
  id: number;
  name: string;
};

type DrugPrescription = {
  drug: Drug;
  intervalHours: number | "";
  daysPerWeek: number | "";
  note: string | null;
};

const DRUGS: Drug[] = [
  { id: 1, name: "استامینوفن ۵۰۰" },
  { id: 2, name: "ایبوپروفن ۴۰۰" },
  { id: 3, name: "ناپروکسن ۲۵۰" },
  { id: 4, name: "دیکلوفناک ۵۰" },
  { id: 5, name: "آسپرین ۸۰" },
  { id: 6, name: "ترامادول ۵۰" },
  { id: 7, name: "کتورولاک ۱۰" },
  { id: 8, name: "متوکاربامول ۵۰۰" },
  { id: 9, name: "باکلوفن ۱۰" },
  { id: 10, name: "تیزانیدین ۴" },

  { id: 11, name: "آموکسی‌سیلین ۵۰۰" },
  { id: 12, name: "آموکسی‌کلاو ۶۲۵" },
  { id: 13, name: "سفالکسین ۵۰۰" },
  { id: 14, name: "سفیکسیم ۴۰۰" },
  { id: 15, name: "سفتریاکسون ۱ گرم" },
  { id: 16, name: "کلاریترومایسین ۵۰۰" },
  { id: 17, name: "آزیترومایسین ۵۰۰" },
  { id: 18, name: "سیپروفلوکساسین ۵۰۰" },
  { id: 19, name: "لووفلوکساسین ۵۰۰" },
  { id: 20, name: "کو-تریموکسازول" },

  { id: 21, name: "متفورمین ۵۰۰" },
  { id: 22, name: "گلی‌بنکلامید ۵" },
  { id: 23, name: "گلیمپیرید ۲" },
  { id: 24, name: "آکاربوز ۵۰" },
  { id: 25, name: "سیتاگلیپتین ۱۰۰" },

  { id: 26, name: "آتنولول ۵۰" },
  { id: 27, name: "متوپرولول ۵۰" },
  { id: 28, name: "پروپرانولول ۴۰" },
  { id: 29, name: "انالاپریل ۱۰" },
  { id: 30, name: "لوزارتان ۵۰" },
  { id: 31, name: "والزارتان ۸۰" },
  { id: 32, name: "آملودیپین ۵" },
  { id: 33, name: "نیفدیپین ۱۰" },
  { id: 34, name: "هیدروکلروتیازید ۲۵" },
  { id: 35, name: "فوروزماید ۴۰" },

  { id: 36, name: "آتورواستاتین ۲۰" },
  { id: 37, name: "روسوواستاتین ۱۰" },
  { id: 38, name: "جمفیبروزیل ۳۰۰" },
  { id: 39, name: "کلُوپیدوگرل ۷۵" },
  { id: 40, name: "وارفارین ۵" },

  { id: 41, name: "امپرازول ۲۰" },
  { id: 42, name: "پنتوپرازول ۴۰" },
  { id: 43, name: "فاموتیدین ۲۰" },
  { id: 44, name: "رانیتیدین ۱۵۰" },
  { id: 45, name: "دامپریدون ۱۰" },
  { id: 46, name: "متوکلوپرامید ۱۰" },

  { id: 47, name: "لورازپام ۱" },
  { id: 48, name: "دیازپام ۵" },
  { id: 49, name: "آلپرازولام ۰.۵" },
  { id: 50, name: "سرترالین ۵۰" },
  { id: 51, name: "فلوکستین ۲۰" },
  { id: 52, name: "ونلافاکسین ۷۵" },

  { id: 53, name: "سالبوتامول اسپری" },
  { id: 54, name: "بودزوناید اسپری" },
  { id: 55, name: "فلوتیکازون اسپری" },
  { id: 56, name: "مونتلوکاست ۱۰" },
  { id: 57, name: "ستیریزین ۱۰" },
  { id: 58, name: "لوراتادین ۱۰" },

  { id: 59, name: "لووتیروکسین ۱۰۰" },
  { id: 60, name: "پردنیزولون ۵" },
  { id: 61, name: "هیدروکورتیزون ۱۰" },
  { id: 62, name: "بتامتازون ۰.۵" },

  { id: 63, name: "فروس سولفات" },
  { id: 64, name: "فولیک اسید ۵" },
  { id: 65, name: "ویتامین D3 1000" },
  { id: 66, name: "کلسیم-دی" },
  { id: 67, name: "منیزیم ۲۵۰" },
  { id: 68, name: "زینک ۵۰" },

  { id: 69, name: "کلوتریمازول کرم" },
  { id: 70, name: "موپیروسین پماد" },
];

const readyNotes = [
  "با غذا مصرف شود",
  "قبل از خواب",
  "بعد از صبحانه",
  "در صورت درد",
  "روزانه ۲ بار",
];

const PrescriptionSection = () => {
  const handleRemove = (id: number) => {
    setSelected((prev) => prev.filter((p) => p.id !== id));
  };
  const [note, setNote] = useState("");

  const handleAddNote = (text: string) => {
    setNote((prev) => {
      if (!prev) return text;
      if (prev.endsWith(text)) return prev;
      return `${prev}، ${text}`;
    });
  };
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Drug[]>([]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DRUGS;
    return DRUGS.filter((d) => d.name.toLowerCase().includes(q));
  }, [query]);

  const toggleSelect = (drug: Drug) => {
    setSelected((prev) =>
      prev.some((x) => x.id === drug.id)
        ? prev.filter((x) => x.id !== drug.id)
        : [...prev, drug],
    );
  };

  return (
    <Card>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>انتخاب دارو</DialogTitle>
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
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">داروها</Typography>
          <Button color="info" variant="outlined" onClick={() => setOpen(true)}>
            نمایش دارو ها
          </Button>
        </Box>
        <Divider sx={{ my: 1 }} />

        {/* تنظیمات هر دارو */}
        <Stack sx={{ mt: 2 }}>
          <Box
            sx={{
              maxHeight: 330,
              overflowY: "auto",
            }}
          >
            {selected.length === 0 ? (
              <Alert color="warning" icon={<WarningIcon />}>
              هنوز دارویی انتخاب نشده است.
            </Alert>
            ) : (
              selected.map((p) => (
                <Card key={p.id} sx={{ mb: 2 }} variant="outlined">
                  <CardContent>
                    <Stack
                      direction="row"
                      sx={{
                        mb: 1,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="subtitle1">{p.name}</Typography>
                      <IconButton
                        onClick={() => handleRemove(p.id)}
                        color="error"
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          fullWidth
                          type="number"
                          label="هر چند ساعت"
                          // value={p}
                          // onChange={(e) =>
                          //   handleUpdate(p.drug.id, {
                          //     intervalHours: e.target.value
                          //       ? Number(e.target.value)
                          //       : "",
                          //   })
                          // }
                          slotProps={{ htmlInput: { min: 1 } }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          fullWidth
                          type="number"
                          label="چند روز در هفته"
                          // value={p.daysPerWeek}
                          // onChange={(e) =>
                          //   handleUpdate(p.drug.id, {
                          //     daysPerWeek: e.target.value
                          //       ? Number(e.target.value)
                          //       : "",
                          //   })
                          // }
                          slotProps={{ htmlInput: { min: 1, max: 7 } }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          fullWidth
                          label="توضیحات"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          multiline
                        />

                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ mt: 1, flexWrap: "wrap" }}
                        >
                          {readyNotes.map((item) => (
                            <Chip
                              key={item}
                              label={item}
                              onClick={() => handleAddNote(item)}
                              sx={{ mb: 1 }}
                              clickable
                            />
                          ))}
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PrescriptionSection;
