"use client";

import { Container, Grid, Typography, Stack, Divider } from "@mui/material";
import DashboardCard from "@/app/components/DashboardCard";
import ShareIcon from "@mui/icons-material/Share";
import PeopleIcon from "@mui/icons-material/People";
import ForumIcon from "@mui/icons-material/Forum";
import BreadcrumbsNav from "@/app/components/BreadcrumbsNav";

export default function QueriesDashboard() {
  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <BreadcrumbsNav />

      {/* ✅ Heading + Subtitle + Divider */}
      <Stack spacing={1} alignItems="flex-start" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          Event Queries Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Share QR code links, manage submitted questions, and track visitor activity during live events.
        </Typography>
        <Divider sx={{ width: "100%", mt: 2 }} />
      </Stack>

      {/* ✅ Cards Grid */}
      <Grid
        container
        spacing={3}
        justifyContent={{ xs: "center", sm: "flex-start" }}
      >
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            title="Share Business Links"
            description="Copy public-facing QR code links for each business."
            buttonLabel="Open Links"
            icon={<ShareIcon />}
            color="#42a5f5" // soft primary blue
            route="/cms/queries/share-link"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            title="Manage Visitors"
            description="View all visitors who submitted questions."
            buttonLabel="View Visitors"
            icon={<PeopleIcon />}
            color="#66bb6a" // pleasant green
            route="/cms/queries/visitors"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            title="Manage Questions"
            description="Review, filter, and mark submitted questions."
            buttonLabel="View Questions"
            icon={<ForumIcon />}
            color="#ab47bc" // calm purple
            route="/cms/queries/questions"
          />
        </Grid>
      </Grid>
    </Container>
  );
}
