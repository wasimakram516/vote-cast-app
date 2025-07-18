"use client";

import {
  Box,
  Button,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import { useRouter } from "next/navigation";
import PollIcon from "@mui/icons-material/Poll";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShieldIcon from "@mui/icons-material/Shield";
import ForumIcon from "@mui/icons-material/Forum";
import PeopleIcon from "@mui/icons-material/People";
import ShareIcon from "@mui/icons-material/Share";

export default function HomePage() {
  const router = useRouter();

  const handleDemoClick = () => {
    router.push(`/polls/demo/vote`);
  };

  const handleCmsClick = () => {
    router.push("/cms");
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, sm: 4 },
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 720,
          backgroundColor: "white",
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
          boxShadow: 6,
          animation: "fadeInUp 0.6s ease",
        }}
      >
        {/* Small Tagline */}
        <Typography
          variant="overline"
          fontWeight="bold"
          color="primary"
          letterSpacing={2}
          gutterBottom
        >
          Polls & Event Engagement Made Simple
        </Typography>

        {/* Main Heading */}
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Welcome to VoteCast
        </Typography>

        {/* Description */}
        <Typography variant="body1" color="text.secondary" mb={4}>
          Build branded polls, capture live feedback, manage visitor questions, and track engagement with QR-powered tools — powered by WhiteWall Digital Solutions.
        </Typography>

        {/* Buttons */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          mb={4}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleDemoClick}
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: "bold",
              borderRadius: 3,
              boxShadow: 2,
              ":hover": {
                boxShadow: 4,
                backgroundColor: "white",
                color: "primary.main",
              },
            }}
          >
            Try a Demo
          </Button>

          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={handleCmsClick}
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: "bold",
              borderRadius: 3,
              ":hover": {
                borderColor: "primary.main",
                backgroundColor: "primary.light",
                color: "white",
              },
            }}
          >
            Go to CMS
          </Button>
        </Stack>

        <Divider sx={{ mb: 4 }} />

        {/* Features */}
        <Stack
          spacing={2}
          direction={{ xs: "column", sm: "row" }}
          flexWrap="wrap"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
          rowGap={3}
        >
          <Stack alignItems="center" spacing={1} width={120}>
            <PollIcon color="primary" fontSize="large" />
            <Typography variant="subtitle2" fontWeight="bold">
              Interactive Polls
            </Typography>
          </Stack>

          <Stack alignItems="center" spacing={1} width={120}>
            <BarChartIcon color="success" fontSize="large" />
            <Typography variant="subtitle2" fontWeight="bold">
              Real-Time Results
            </Typography>
          </Stack>

          <Stack alignItems="center" spacing={1} width={120}>
            <ShieldIcon color="warning" fontSize="large" />
            <Typography variant="subtitle2" fontWeight="bold">
              Secure Voting
            </Typography>
          </Stack>

          <Stack alignItems="center" spacing={1} width={120}>
            <ForumIcon color="secondary" fontSize="large" />
            <Typography variant="subtitle2" fontWeight="bold">
              Visitor Questions
            </Typography>
          </Stack>

          <Stack alignItems="center" spacing={1} width={120}>
            <PeopleIcon sx={{ color: "#6d4c41" }} fontSize="large" />
            <Typography variant="subtitle2" fontWeight="bold">
              Live Visitors
            </Typography>
          </Stack>

          <Stack alignItems="center" spacing={1} width={120}>
            <ShareIcon sx={{ color: "#00838f" }} fontSize="large" />
            <Typography variant="subtitle2" fontWeight="bold">
              QR Link Sharing
            </Typography>
          </Stack>
        </Stack>
      </Box>

      {/* Animation keyframes */}
      <style jsx global>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Box>
  );
}
