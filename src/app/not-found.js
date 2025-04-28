"use client";

import { Box, Button, Container, Typography, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NotFoundPage() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Image
          src="/voteCast.png" 
          alt="VoteCast Logo"
          width={120}
          height={45}
          style={{ marginBottom: 10 }}
        />
        <Typography variant="h1" fontWeight="bold" sx={{ fontSize: "5rem", color: "#033649" }}>
          404
        </Typography>
      </Box>

      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Page Not Found
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Oops! The page you are looking for doesn’t exist or has been moved.
      </Typography>

      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          size="large"
          onClick={handleGoHome}
          sx={{
            bgcolor: "#033649",
            ":hover": { bgcolor: "#022e3a" },
            px: 4,
          }}
        >
          Go to Home
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => router.back()}
          sx={{
            color: "#033649",
            borderColor: "#033649",
            ":hover": {
              bgcolor: "#f5f5f5",
              borderColor: "#022e3a",
              color: "#022e3a",
            },
            px: 4,
          }}
        >
          Go Back
        </Button>
      </Stack>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 6 }}
      >
        Powered by{" "}
        <a
          href="https://whitewall.om"
          target="_blank"
          style={{ color: "#033649", textDecoration: "none", fontWeight: 500 }}
        >
          WhiteWall Digital Solutions
        </a>
      </Typography>
    </Container>
  );
}
