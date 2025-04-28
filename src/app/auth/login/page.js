"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  Paper,
  IconButton,
  Stack,
  Divider,
  InputAdornment,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import HomeIcon from "@mui/icons-material/Home";
import { useRouter } from "next/navigation";
import { login } from "@/app/services/authService";
import { useAuth } from "@/app/context/AuthContext";
import { useMessage } from "@/app/context/MessageContext";
import Image from "next/image";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const { showMessage } = useMessage();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      const response = await login(form.email, form.password);
      setUser(response.user);
      router.push("/cms");
    } catch (err) {
      showMessage("Invalid credentials. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 10, borderRadius: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <IconButton onClick={() => router.push("/")} aria-label="Go home">
            <HomeIcon />
          </IconButton>
          <Image
            src="/voteCast.png"
            alt="VoteCast Logo"
            width={100}
            height={40}
          />
        </Stack>

        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
        >
          Sign in to VoteCast CMS
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 3 }}
        >
          Enter your email and password to continue.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <LoginIcon />
              )
            }
            disabled={loading}
            sx={{ mt: 1 }}
          >
            {loading ? "Logging in..." : "Sign In"}
          </Button>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 2 }}
        >
          Don’t have an account?{" "}
          <a
            href="/auth/register"
            style={{ color: "#033649", fontWeight: 500 }}
          >
            Register here
          </a>
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          textAlign="center"
        >
          Powered by{" "}
          <a
            href="https://whitewall.om"
            target="_blank"
            style={{ color: "#033649" }}
          >
            WhiteWall Digital Solutions
          </a>
        </Typography>
      </Paper>
    </Container>
  );
}
