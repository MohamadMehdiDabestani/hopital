import {
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useField } from "formik";
const readyNotes = [
  "با غذا مصرف شود",
  "قبل از خواب",
  "بعد از صبحانه",
  "در صورت درد",
  "روزانه ۲ بار",
];
type MedicineRowProps = {
  index: number;
  medicineName: string;
  onRemove: () => void;
};
export const MedicineRow = ({ medicineName, index, onRemove }: MedicineRowProps) => {
  const [intervalField, intervalMeta] = useField(
    `medicines.${index}.intervalHours`,
  );
  const [daysField, daysMeta] = useField(`medicines.${index}.daysPerWeek`);
  const [noteField, noteMeta] = useField(`medicines.${index}.note`);

  const addNote = (text: string) => {
    const current = noteField.value ?? "";
    const next = current
      ? current.endsWith(text)
        ? current
        : `${current}، ${text}`
      : text;
    noteField.onChange({
      target: { name: noteField.name, value: next },
    } as any);
  };
  return (
    <Card sx={{ mb: 2 }} variant="outlined">
      <CardContent>
        <Stack
          direction="row"
          sx={{ mb: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Typography variant="subtitle1">{medicineName}</Typography>
          <IconButton onClick={onRemove} color="error" sx={{ ml: 1 }}>
            <DeleteIcon />
          </IconButton>
        </Stack>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              type="number"
              label="هر چند ساعت"
              
            //   {...intervalField}
              onChange={(e) => {
                const v = e.target.value;
                intervalField.onChange({
                  target: {
                    name: intervalField.name,
                    value: v === "" ? undefined : Number(v),
                  },
                } as any);
              }}
              value={intervalField.value ?? ""}
              slotProps={{ htmlInput: { min: 1 } }}
              error={!!intervalMeta.touched && !!intervalMeta.error}
              helperText={intervalMeta.touched && intervalMeta.error}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              type="number"
              label="چند روز در هفته"
              value={daysField.value ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                daysField.onChange({
                  target: {
                    name: daysField.name,
                    value: v === "" ? undefined : Number(v),
                  },
                } as any);
              }}
              slotProps={{ htmlInput: { min: 1, max: 7 } }}
              error={!!daysMeta.touched && !!daysMeta.error}
              helperText={daysMeta.touched && daysMeta.error}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="توضیحات"
              {...noteField}
              multiline
              error={!!noteMeta.touched && !!noteMeta.error}
              helperText={noteMeta.touched && noteMeta.error}
            />
            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
              {readyNotes.map((item) => (
                <Chip
                  key={item}
                  label={item}
                  onClick={() => addNote(item)}
                  sx={{ mb: 1 }}
                  clickable
                />
              ))}
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
