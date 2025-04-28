"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Drawer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { getBusinesses } from "@/app/services/businessService";
import { getResults } from "@/app/services/resultService";
import ResultsChart from "@/app/components/ResultsChart";
import BreadcrumbsNav from "@/app/components/BreadcrumbsNav";

export default function ResultsPage() {
  const [businesses, setBusinesses] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(""); // '', 'active', 'archived'

  const fetchBusinesses = async () => {
    try {
      const data = await getBusinesses();
      setBusinesses(data);
    } catch (error) {
      console.error("Failed to fetch businesses", error);
    }
  };

  const fetchResults = async (businessSlug, status = "") => {
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

  const handleBusinessSelect = (businessSlug, status = "") => {
    setSelectedBusiness(businessSlug);
    setSelectedStatus(status);
    fetchResults(businessSlug, status);
    setDrawerOpen(false);
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: 320, p: 2, bgcolor: "background.default" },
        }}
      >
        <Stack spacing={2} sx={{ height: "100%" }}>
          {/* Top Header */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" fontWeight="bold">
              Select Business
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <Divider />

          {/* Business Accordions */}
          <Box sx={{ flexGrow: 1, overflowY: "auto", mt: 1 }}>
            {businesses.length > 0 ? (
              businesses.map((business) => (
                <Accordion key={business._id} disableGutters elevation={0}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      px: 2,
                      py: 1,
                    }}
                  >
                    <Typography fontWeight="bold">{business.name}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={1}>
                      <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        onClick={() => handleBusinessSelect(business.slug, "")}
                      >
                        All Polls
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        color="success"
                        onClick={() =>
                          handleBusinessSelect(business.slug, "active")
                        }
                      >
                        Active Polls
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        color="warning"
                        onClick={() =>
                          handleBusinessSelect(business.slug, "archived")
                        }
                      >
                        Archived Polls
                      </Button>
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                mt={4}
              >
                No businesses found.
              </Typography>
            )}
          </Box>
        </Stack>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ p: 4, flexGrow: 1 }}>
        <BreadcrumbsNav />

        {/* Top Header */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
          mb={3}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Poll Results Viewer
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Select a business and poll status from the sidebar to view
              results.
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              variant="outlined"
              onClick={() => setDrawerOpen(true)}
              sx={{
                minWidth: { xs: "100%", sm: "auto" },
                fontWeight: "bold",
                fontSize: "1rem",
                py: 1.5,
              }}
            >
              Select Business
            </Button>

            {/* View Full Screen CTA */}
            {results.length > 0 && (
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  window.open(
                    `/cms/polls/results/full?businessSlug=${selectedBusiness}&status=${selectedStatus}`,
                    "_blank"
                  )
                }
                sx={{
                  minWidth: { xs: "100%", sm: "auto" },
                  fontWeight: "bold",
                  fontSize: "1rem",
                  py: 1.5,
                }}
              >
                View Full Screen
              </Button>
            )}
          </Stack>
        </Stack>

        <Divider sx={{ mb: 4 }} />

        {/* Results Section */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            <CircularProgress />
          </Box>
        ) : results.length > 0 ? (
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
          selectedBusiness && (
            <Typography textAlign="center" mt={4} variant="body1">
              No results available for the selected business and status.
            </Typography>
          )
        )}
      </Box>
    </Box>
  );
}
