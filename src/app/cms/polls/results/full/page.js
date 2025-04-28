"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { getResults } from "@/app/services/resultService";
import ResultsChart from "@/app/components/ResultsChart";

export default function FullScreenResultsPage() {
  const searchParams = useSearchParams();
  const businessSlug = searchParams.get("businessSlug");
  const status = searchParams.get("status") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const data = await getResults(businessSlug, status);
      setResults(data);
    } catch (error) {
      console.error("Failed to fetch results", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (businessSlug) {
      fetchResults();

      // Auto-refresh every 10 seconds
      const interval = setInterval(() => {
        fetchResults();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [businessSlug, status]);

  if (loading && results.length === 0) {
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
        bgcolor: "background.default",
        pt: { xs: 10, md: 12 },
        px: { xs: 2, md: 4 },
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
        <Box
          sx={{
            width: { xs: 35, sm: 40 },
            height: "auto",
          }}
        >
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
          sx={{
            bgcolor: "grey.400",
            height: 30,
            marginLeft: "8px",
          }}
        />

        <Box
          sx={{
            width: { xs: 90, sm: 90 },
            height: "auto",
          }}
        >
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

      {/* ✅ Results Section */}
      {results.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 4,
            py: 4,
          }}
        >
          {results.map((poll) => (
            <ResultsChart key={poll._id} poll={poll} />
          ))}
        </Box>
      ) : (
        <Typography textAlign="center" variant="h6" mt={12}>
          No results available.
        </Typography>
      )}
    </Box>
  );
}
