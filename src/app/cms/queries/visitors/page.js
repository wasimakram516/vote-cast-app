"use client";

import {
  Box,
  Container,
  Typography,
  Stack,
  Divider,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import BreadcrumbsNav from "@/app/components/BreadcrumbsNav";
import { useEffect, useState } from "react";
import { getVisitors } from "@/app/services/visitorService";

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVisitors = async () => {
    try {
      const data = await getVisitors();
      setVisitors(data);
    } catch (error) {
      console.error("Failed to load visitors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <BreadcrumbsNav />

      {/* ✅ Heading + Subtitle + Divider */}
      <Stack spacing={1} alignItems="flex-start" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          Visitor Tracking
        </Typography>
        <Typography variant="body2" color="text.secondary">
          View all visitors and the businesses they have interacted with during
          events.
        </Typography>
        <Divider sx={{ width: "100%", mt: 2 }} />
      </Stack>

      {loading ? (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {visitors.map((v) => (
            <Grid item xs={12} sm={6} md={4} key={v._id}>
              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PersonIcon fontSize="small" color="action" />
                      <Typography variant="subtitle1" fontWeight="bold">
                        {v.name}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {v.phone || "Not provided"}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <BusinessIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {v.company || "Not provided"}
                      </Typography>
                    </Stack>
                  </Stack>

                  {/* Event History */}
                  {v.eventHistory?.length > 0 && (
                    <Box mt={3} p={2} borderRadius={2} bgcolor="grey.100">
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Event Participation
                      </Typography>

                      <Stack spacing={1}>
                        {v.eventHistory.map((event, idx) => (
                          <Box key={idx} display="flex" flexDirection="column">
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <BusinessIcon fontSize="small" color="primary" />
                              <Typography variant="body2" fontWeight="medium">
                                {event.business?.name || "Unknown Business"}
                              </Typography>
                            </Stack>
                            <Stack
                              direction="row"
                              spacing={2}
                              sx={{ pl: 4 }}
                              alignItems="center"
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Visits: {event.count}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Last:{" "}
                                {new Date(
                                  event.lastInteraction
                                ).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </Typography>
                            </Stack>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
