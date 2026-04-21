"use client";
import { useAuthForm } from "@/features/auth";
import { TextField, Button, Box, Container } from "@mui/material";
export const LoginForm = () => {
  const formik = useAuthForm((values) => {
    console.log("Submitted:", values);
  });
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm">
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            bgcolor: "white",
            borderRadius: 2,
            p: 3,
          }}
        >
          <TextField
            name="phone"
            label="شماره همراه"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
            fullWidth
            slotProps={{
              htmlInput: { maxLength: 11, inputMode: "numeric" },
            }}
          />

          <TextField
            name="password"
            label="رمز عبور"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            fullWidth
          />

          <Button variant="contained" type="submit">
            ورود
          </Button>
        </Box>
      </Container>
    </Box>
  );
};
