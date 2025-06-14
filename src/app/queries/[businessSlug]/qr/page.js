"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import QRCode from "react-qr-code";
import Image from "next/image";

export default function PublicQrPage() {
  const { businessSlug } = useParams();
  const [askPageUrl, setAskPageUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && businessSlug) {
      setAskPageUrl(`${window.location.origin}/queries/${businessSlug}/ask`);
    }
  }, [businessSlug]);

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: 10,
        textAlign: "center",
      }}
    >
      {/* ✅ Sticky Branding */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          bgcolor: "background.default",
          zIndex: 10,
          py: 1,
          px: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Box sx={{ width: { xs: 35, sm: 40 } }}>
          <Image
            src="/WW.png"
            alt="WhiteWall Logo"
            width={100}
            height={30}
            style={{ width: "100%", height: "auto", objectFit: "contain" }}
          />
        </Box>

        <Divider
          orientation="vertical"
          flexItem
          sx={{ bgcolor: "grey.400", height: 30, mx: 2 }}
        />

        <Box sx={{ width: { xs: 90, sm: 90 } }}>
          <Image
            src="/voteCast.png"
            alt="VoteCast Logo"
            width={120}
            height={40}
            style={{ width: "100%", height: "auto", objectFit: "contain" }}
          />
        </Box>
      </Box>

      {/* ✅ Heading */}
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
        Scan to Ask a Question
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Use your phone to scan this QR code and participate. You can post a new
        question or vote on existing ones.
      </Typography>

      {/* ✅ QR Code or Loader */}
      {askPageUrl ? (
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: "#fff",
            boxShadow: 3,
            width: "100%",
            maxWidth: 300,
          }}
        >
          <QRCode
            value={askPageUrl}
            size={256}
            bgColor="#ffffff"
            fgColor="#000000"
            style={{ width: "100%", height: "auto" }}
          />
        </Box>
      ) : (
        <CircularProgress sx={{ mt: 4 }} />
      )}

      {/* ✅ Footer */}
      <Typography variant="caption" color="text.secondary" mt={3}>
        Powered by WhiteWall Digital Solutions
      </Typography>
    </Container>
  );
}
