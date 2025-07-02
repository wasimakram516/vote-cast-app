"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";
import QRCode from "react-qr-code";
import Image from "next/image";
import Footer from "@/app/components/Footer";
import { getBusinessBySlug } from "@/app/services/businessService";
import { useLanguage } from "@/app/context/LanguageContext";
import LanguageSelector from "@/app/components/LanguageSelector";

export default function PublicQrPage() {
  const { businessSlug } = useParams();
  const [askPageUrl, setAskPageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [business, setBusiness] = useState(null);
  const { language } = useLanguage();

  const translations = {
    en: {
      scanTitle: "Scan to Ask a Question",
      scanDesc:
        "Use your phone to scan this QR code and participate. You can post a new question or vote on existing ones.",
    },
    ar: {
      scanTitle: "امسح لطرح سؤال",
      scanDesc:
        "استخدم هاتفك لمسح رمز QR هذا والمشاركة. يمكنك إرسال سؤال جديد أو التصويت على الأسئلة الموجودة.",
    },
  };

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        const businessData = await getBusinessBySlug(businessSlug);
        if (typeof window !== "undefined") {
          const origin = window.location.origin;
          setAskPageUrl(`${origin}/queries/${businessSlug}/ask`);
        }
        setBusiness(businessData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    if (businessSlug) {
      fetchBusiness();
    }
  }, [businessSlug]);

  if (loading || !business || !askPageUrl) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container
      disableGutters
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        pb: 4,
        px: 2,
      }}
    >
      <LanguageSelector />

      {business?.logoUrl && (
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <img
            src={business.logoUrl}
            alt={`${business.name} Logo`}
            style={{
              maxWidth: "250px",
              width: "70%",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </Box>
      )}

      <Box sx={{ width: "100%", maxWidth: 800, mt: 4 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{ textAlign: "center" }}
        >
          {translations[language].scanTitle}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, textAlign:"center"}}
        >
          {translations[language].scanDesc}
        </Typography>

        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: "#fff",
            boxShadow: 3,
            width: "100%",
            maxWidth: 300,
            mx: "auto",
            mb: 4,
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
      </Box>

      {/* Infographic */}
      <Box sx={{ width: "70%", mb: 6 }}>
        <Image
          src="/info.png"
          alt="Infographic"
          width={800}
          height={400}
          style={{ width: "100%", height: "auto", objectFit: "contain" }}
        />
      </Box>

      {/* Footer */}
      <Footer />
    </Container>
  );
}
