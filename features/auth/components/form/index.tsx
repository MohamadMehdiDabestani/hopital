"use client";
import { useState, useTransition } from "react";
import { loginUser, useAuthForm } from "@/features/auth";
import { useNotificationStore } from "@/features/core";
import { ActionErrorMapping } from "@/features/core/utils/actionErrorMapping";
import {
  TextField,
  Button,
  Box,
  Container,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
  Divider,
} from "@mui/material";
import { Visibility, VisibilityOff, LockPerson } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export const LoginForm = () => {
  const [loading, startLoading] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const { show } = useNotificationStore();
  const router = useRouter();

  const formik = useAuthForm((values) => {
    startLoading(async () => {
      try {
        const res = await loginUser(values);
        if (!res.ok) {
          show(res.message, "error");
          return;
        }
        await router.push("/dashboard");
      } catch (err: any) {
        show(ActionErrorMapping(err), "error");
      }
    });
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f7fa",
        backgroundImage: `radial-gradient(#d1d5db 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            borderRadius: 3,
            bgcolor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(4px)",
          }}
        >
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <LockPerson color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
              }}
            >
              ورود به سامانه
            </Typography>
            <Typography variant="body2" color="text.secondary">
              اطلاعات کاربری خود را وارد کنید
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            <TextField
              name="phone"
              label="شماره همراه"
              autoComplete="username"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
              fullWidth
              slotProps={{
                htmlInput: {
                  "data-testid": "phone",
                  maxLength: 11,
                  inputMode: "numeric",
                },
              }}
              // data-testid="phone"
            />

            <TextField
              name="password"
              label="رمز عبور"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              fullWidth
              slotProps={{
                htmlInput: {
                  "data-testid": "password",
                },
                input: {
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      data-testid="toggle-password"
                    >
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              variant="contained"
              type="submit"
              size="large"
              loading={loading}
              sx={{ py: 1.2, fontWeight: "bold", fontSize: "1.1rem" }}
              aria-label={
                showPassword ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"
              }
              data-testid="login-submit"
            >
              ورود
            </Button>

            <Divider sx={{ my: 1 }}>
              <Typography variant="caption" color="text.secondary">
                راهنما
              </Typography>
            </Divider>

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                حساب ندارید؟ <b>از مدیر درخواست کنید</b>
              </Typography>
              <br />
              <Typography variant="caption" color="text.secondary">
                فراموشی رمز؟ <b> از مدیر درخواست ریست کنید</b>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
