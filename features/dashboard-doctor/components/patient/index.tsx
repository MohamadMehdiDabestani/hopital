"use client";
import { Fragment, useState, useTransition } from "react";
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
  TextField,
} from "@mui/material";
import { Grid } from "@mui/system";
import { Prescription } from "./prescription";
import { Paraclinic } from "./paraclinick";
import {
  getNextPatientAction,
  useDashboardDoctorForm,
} from "@/features/dashboard-doctor";
import { FormikProvider } from "formik";
import { useNotificationStore } from "@/features/core";
import { DoctorPatientSkeleton } from "./skeletonLoading";
import { MedicineItem, Item, VisitHistory } from "@/features/dashboard-doctor/type";

export const DoctorPatient = ({
  medicineList,
  testList
}: {
  medicineList: MedicineItem[];
  testList : Item[]
}) => {
  const [currentPatient, setCurrentPatient] = useState<VisitHistory | null>(
    null,
  );
  const [history, setHistory] = useState<VisitHistory[]>([]);
  const [loading, startTransition] = useTransition();
  const { show } = useNotificationStore();
  const formik = useDashboardDoctorForm((values) => console.log(values));

  const handleNextPatient = () => {
    startTransition(() => {
      (async () => {
        try {
          const res = await getNextPatientAction();

          if (!res.ok) {
            show("مشکلی پیش آمده", "error");
            return;
          }

          const list = res.data ?? [];
          setCurrentPatient(list[0] ?? null);
          setHistory(list.slice(1));
          if (list.length == 0) show("فعلا بیماری وجود ندارد", "warning");
          formik.resetForm();
        } catch (err) {
          setCurrentPatient(null);
        }
      })();
    });
  };
  return (
    <FormikProvider value={formik}>
      <Grid
        container
        spacing={2}
        component="form"
        onSubmit={formik.handleSubmit}
      >
        {!currentPatient && !loading ? (
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
        ) : loading ? (
          <DoctorPatientSkeleton />
        ) : (
          <Fragment>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent sx={{ "&>p": { mb: 2 } }}>
                  <Typography variant="h6">اطلاعات بیمار</Typography>
                  <Divider sx={{ my: 1 }} />

                  <Typography>
                    نام و نام خانوادگی:{" "}
                    {`${currentPatient?.firstName ?? ""} ${currentPatient?.lastName ?? ""}`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
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
                    {history && history.length > 0 ? (
                      <List>
                        {history.map((h, i) => (
                          <ListItem key={i} divider>
                            <ListItemText
                              primary={`تاریخ: ${h?.treatTime}`}
                              secondary={h.extraNotes?.substring(0, 100)}
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
              <Card>
                <CardContent>
                  {medicineList.length == 0 ? (
                    <Alert>دارویی ثبت نشده</Alert>
                  ) : (
                    <Prescription list={medicineList} />
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paraclinic list={testList} />
              <Card sx={{ mt: 2, width: "100%" }}>
                <CardContent>
                  <TextField
                    fullWidth
                    sx={{ mb: 2 }}
                    label="توضیحات اضافه ویزیت"
                    id="extraNotes"
                    name="extraNotes"
                    value={formik.values.extraNotes}
                    onChange={formik.handleChange}
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
