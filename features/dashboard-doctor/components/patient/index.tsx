"use client";
import { Fragment, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import { Grid } from "@mui/system";
import { PrescriptionSection } from "./prescription";
import { Paraclinic } from "./paraclinick";
import { useDashboardDoctorForm } from "@/features/dashboard-doctor";
import { FormikProvider } from "formik";

type VisitHistory = {
  date: string;
  notes: string;
};

type Patient = {
  id: number;
  fullName: string;
  birthYear: number;
  specialDiseases?: string;
  extraNotes?: string;
  history?: VisitHistory[];
};

const mockPatient: Patient = {
  id: 1,
  fullName: "علی رضایی",
  birthYear: 1368,
  specialDiseases: "دیابت نوع ۲",
  extraNotes: "",
  history: [
    { date: "1403/11/20", notes: "ویزیت اولیه، تجویز دارو" },
    { date: "1404/01/05", notes: "بهبود علائم، ادامه درمان" },
    { date: "1404/01/05", notes: "بهبود علائم، ادامه درمان" },
    { date: "1404/01/05", notes: "بهبود علائم، ادامه درمان" },
    { date: "1404/01/05", notes: "بهبود علائم، ادامه درمان" },
    { date: "1404/01/05", notes: "بهبود علائم، ادامه درمان" },
    { date: "1404/01/05", notes: "بهبود علائم، ادامه درمان" },
    { date: "1404/01/05", notes: "بهبود علائم، ادامه درمان" },
  ],
};

export const DoctorPatient = () => {
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);

  const handleNextPatient = () => {
    setCurrentPatient(mockPatient);
  };
  const formik = useDashboardDoctorForm((values) => console.log(values));
  return (
    <FormikProvider value={formik}>
      <Grid
        container
        spacing={2}
        component="form"
        onSubmit={formik.handleSubmit}
      >
        {!currentPatient ? (
          <Grid size={{ xs: 12 }}>
            <Button fullWidth variant="contained" onClick={handleNextPatient}>
              ورود بیمار بعدی
            </Button>
            <Paper sx={{ mt: 4, p: 3, textAlign: "center" }} elevation={2}>
              <Typography variant="h6">هنوز بیماری وارد نشده است</Typography>
              <Typography variant="body2" color="text.secondary">
                برای شروع، روی دکمه «ورود بیمار بعدی» کلیک کنید.
              </Typography>
            </Paper>
          </Grid>
        ) : (
          <Fragment>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent sx={{ "&>p": { mb: 2 } }}>
                  <Typography variant="h6">اطلاعات بیمار</Typography>
                  <Divider sx={{ my: 1 }} />

                  <Typography>
                    نام و نام خانوادگی: {currentPatient.fullName}
                  </Typography>
                  <Typography>سال تولد: {currentPatient.birthYear}</Typography>
                  <Typography>
                    بیماری‌های خاص:{" "}
                    {currentPatient.specialDiseases || "ثبت نشده"}
                  </Typography>
                  <Typography>
                    توضیحات اضافه: {currentPatient.extraNotes || "ثبت نشده"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {/* تاریخچه ویزیت‌ها */}
              <Card>
                <CardContent>
                  <Typography variant="h6">تاریخچه ویزیت‌ها</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box
                    sx={{
                      maxHeight: 160,
                      overflowY: "auto",
                    }}
                  >
                    {currentPatient.history &&
                    currentPatient.history.length > 0 ? (
                      <List>
                        {currentPatient.history.map((h, i) => (
                          <ListItem key={i} divider>
                            <ListItemText
                              primary={`تاریخ: ${h.date}`}
                              secondary={h.notes}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Alert severity="info">تاریخچه‌ای ثبت نشده است</Alert>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <PrescriptionSection />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paraclinic />
              <Card sx={{ mt: 2, width: "100%" }}>
                <CardContent>
                  <TextField
                    fullWidth
                    sx={{ mb: 2 }}
                    label="بیماری های خاص بیمار"
                    // value={}
                    // onChange={}
                    multiline
                  />
                  <TextField
                    fullWidth
                    sx={{ mb: 2 }}
                    label="توضیحات اضافه بیمار"
                    // value={}
                    // onChange={}
                    multiline
                  />
                  <TextField
                    fullWidth
                    sx={{ mb: 2 }}
                    label="توضیحات اضافه ویزیت"
                    // value={}
                    // onChange={}
                    multiline
                  />

                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button color="success" variant="contained" type="submit">
                      اتمام ویزیت
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Fragment>
        )}
      </Grid>
    </FormikProvider>
  );
};
