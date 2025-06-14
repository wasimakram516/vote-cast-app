"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  CircularProgress,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import Image from "next/image";
import { getQuestions } from "@/app/services/questionService";

export default function LiveQuestionDisplay() {
  const { businessSlug } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await getQuestions(businessSlug);
      const unanswered = data.filter((q) => !q.answered);
      setQuestions(unanswered);
    } catch (error) {
      console.error("Failed to fetch questions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    const interval = setInterval(fetchQuestions, 10000);
    return () => clearInterval(interval);
  }, [businessSlug]);

  if (loading && questions.length === 0) {
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
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f0f4f8",
        px: { xs: 2, sm: 4 },
        pt: 12,
        display: "flex",
        flexWrap: "wrap",
        gap: 5,
        justifyContent: "center",
        alignItems: "flex-start",
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
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
            }}
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
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </Box>
      </Box>

      {/* ✅ Question Cards */}
      {questions.length === 0 ? (
        <Typography variant="h6" color="text.secondary">
          No questions yet.
        </Typography>
      ) : (
        questions.map((q) => (
          <Box
            key={q._id}
            sx={{
              width: { xs: 280, sm: 320, md: 360 },
              minHeight: 120,
              px: 3,
              py: 3,
              borderRadius: 4,
              background: "linear-gradient(135deg, #1565c0, #00acc1)",
              color: "white",
              boxShadow: 5,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {/* ✅ Elegant Votes Chip */}
            <Chip
              label={`${q.votes}`}
              sx={{
                position: "absolute",
                top: -16,
                right: -16,
                bgcolor: "error.main",
                color: "white",
                fontWeight: "bold",
                fontSize: "1.5rem",
                width: 48,
                height: 48,
                borderRadius: "50%",
                boxShadow: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            />

            {/* ✅ Question Text */}
            <Typography
              sx={{
                fontSize: {
                  xs: "1.2rem",
                  sm: "1.5rem",
                  md: "1.8rem",
                },
                fontWeight: 600,
                lineHeight: 1.5,
                whiteSpace: "pre-wrap",
                overflowWrap: "break-word",
              }}
            >
              {q.text}
            </Typography>
          </Box>
        ))
      )}
    </Box>
  );
}
