"use client";

import {
  Box,
  Typography,
  Container,
  Grid,
  Stack,
  Divider,
} from "@mui/material";

import GroupIcon from "@mui/icons-material/Group";
import BusinessIcon from "@mui/icons-material/Business";
import PollIcon from "@mui/icons-material/Poll";
import ForumIcon from "@mui/icons-material/Forum";
import DashboardCard from "@/app/components/DashboardCard";
import { useAuth } from "@/app/context/AuthContext";

export default function CmsDashboard() {
  const { user } = useAuth();

  const isAdmin = ["admin", "superadmin"].includes(user?.role);
  const isBusiness = user?.role === "business";

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb:6 }}>
      {/* Heading Section */}
      <Box sx={{ mb: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          flexWrap="wrap"
          rowGap={2}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Welcome to VoteCast CMS
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {isAdmin
                ? "You have full access to manage businesses, polls, and questions."
                : "You can manage and launch polls and questions for your business."}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ mt: 3 }} />
      </Box>

      {/* CMS Navigation Cards */}
      <Grid
        container
        spacing={3}
        justifyContent={{ xs: "center", sm: "flex-start" }}
        sx={{ mt: 1 }}
      >
        {isAdmin && (
          <DashboardCard
            title="Users"
            description="View and manage all registered users."
            buttonLabel="Manage Users"
            icon={<GroupIcon />}
            color="primary.main"
            route="/cms/users"
          />
        )}

        {(isAdmin || isBusiness) && (
          <>
            <DashboardCard
              title="Businesses"
              description="View and manage your businesses."
              buttonLabel="Manage Businesses"
              icon={<BusinessIcon />}
              color="#ff7043"
              route="/cms/businesses"
            />

            <DashboardCard
              title="Polls"
              description="Create, launch, and track real-time polls."
              buttonLabel="Manage Polls"
              icon={<PollIcon />}
              color="#4caf50"
              route="/cms/polls"
            />

            <DashboardCard
              title="Visitor Queries"
              description="Review and manage live questions submitted during events."
              buttonLabel="View Queries"
              icon={<ForumIcon />}
              color="#1976d2"
              route="/cms/queries"
            />
          </>
        )}
      </Grid>
    </Container>
  );
}
