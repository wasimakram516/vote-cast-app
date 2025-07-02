"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Box, CircularProgress, Typography } from "@mui/material";
import { getQuestions } from "@/app/services/questionService";
import Footer from "@/app/components/Footer";
import { getBusinessBySlug } from "@/app/services/businessService";

export default function LiveQuestionDisplay() {
  const { businessSlug } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [business, setBusiness] = useState(null);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const [questionData, businessData] = await Promise.all([
        getQuestions(businessSlug),
        getBusinessBySlug(businessSlug),
      ]);
      const unanswered = questionData.filter((q) => !q.answered);
      setQuestions(unanswered);
      setBusiness(businessData);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    const interval = setInterval(fetchQuestions, 10000);
    return () => clearInterval(interval);
  }, [businessSlug]);

  const bubbles = useMemo(() => {
    const sorted = [...questions].sort((a, b) => b.votes - a.votes);
    return sorted.map((q) => {
      const clampedVotes = Math.min(q.votes, 10);
      const stepSize = (2 - 1.1) / 9;
      const fontSize = 1.1 + (clampedVotes - 1) * stepSize;
      const scale = 1 + clampedVotes * 0.05;
      return {
        ...q,
        floatDuration: `${3 + Math.random() * 3}s`,
        floatDelay: `${Math.random() * 2}s`,
        fadeDelay: `${Math.random() * 0.5}s`,
        fontSize: `${fontSize.toFixed(2)}rem`,
        scale: scale.toFixed(2),
      };
    });
  }, [questions]);

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
        pt: 2,
        mb:10
      }}
    >
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

      {business?.brandingUrl && (
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <img
            src={business.brandingUrl}
            alt={`${business.name} Branding`}
            style={{
              width: "auto",
              height: "100px",
              objectFit: "contain",
            }}
          />
        </Box>
      )}

      {/* Bubbles */}
      {questions.length === 0 ? (
        <Typography
          variant="h6"
          color="text.secondary"
          textAlign="center"
          mt={6}
        >
          No questions yet.
        </Typography>
      ) : (
        <div className="question-container">
          {bubbles.map((q) => {
            const style = {
              "--float-duration": q.floatDuration,
              "--float-delay": q.floatDelay,
              "--fade-delay": q.fadeDelay,
              "--scale": q.scale,
              fontSize: q.fontSize,
            };

            return (
              <div key={q._id} className="bubble-question" style={style}>
                {q.votes > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: -12,
                      right: -12,
                      background: "#d32f2f",
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: "50%",
                      width: 36,
                      height: 36,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 0 8px rgba(0,0,0,0.3)",
                      fontSize: "1rem",
                    }}
                  >
                    {q.votes}
                  </span>
                )}

                {q.text}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <Footer />
    </Box>
  );
}
