"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Stack,
  IconButton,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Tooltip,
  Chip,
  Drawer,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import PollIcon from "@mui/icons-material/Poll";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { useMessage } from "@/app/context/MessageContext";
import { useAuth } from "@/app/context/AuthContext";
import {
  getPolls,
  createPoll,
  clonePoll,
  updatePoll,
  deletePoll,
} from "@/app/services/pollService";
import { getBusinesses } from "@/app/services/businessService";
import BreadcrumbsNav from "@/app/components/BreadcrumbsNav";
import PollFormDrawer from "@/app/components/PollFormDrawer";
import ConfirmationDialog from "@/app/components/ConfirmationDialog";
import SharePollModal from "@/app/components/SharePollModal";

export default function ManagePollsPage() {
  const { user } = useAuth();
  const { showMessage } = useMessage();

  const [polls, setPolls] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [editPoll, setEditPoll] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const [shareOpen, setShareOpen] = useState(false);
  const [sharePoll, setSharePoll] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const fetchBusinesses = async () => {
    try {
      const data = await getBusinesses();
      setBusinesses(data);
    } catch {
      showMessage("Failed to load businesses", "error");
    }
  };

  const fetchPolls = async (businessSlug = "", status = "") => {
    try {
      setLoading(true);
      const pollsData = await getPolls(businessSlug, status);
      setPolls(pollsData);
    } catch (error) {
      console.error(error);
      showMessage("Failed to load polls", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleSubmit = async (formData, id = null) => {
    try {
      if (id) {
        await updatePoll(id, formData);
        showMessage("Poll updated successfully", "success");
      } else {
        await createPoll(formData);
        showMessage("Poll created successfully", "success");
      }
      if (selectedBusiness) {
        fetchPolls(selectedBusiness, selectedStatus);
      }
      setOpenDrawer(false);
      setEditPoll(null);
    } catch {
      showMessage("Failed to save poll", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await deletePoll(confirmDelete.id);
      showMessage("Poll deleted successfully", "success");
      if (selectedBusiness) {
        fetchPolls(selectedBusiness, selectedStatus);
      }
    } catch (err) {
      showMessage(
        err?.response?.data?.message || "Failed to delete poll",
        "error"
      );
    } finally {
      setConfirmDelete({ open: false, id: null });
    }
  };

  const handleBusinessSelect = (businessSlug, status = "") => {
    setSelectedBusiness(businessSlug);
    setSelectedStatus(status);
    fetchPolls(businessSlug, status);
    setDrawerOpen(false);
  };

  const handleClone = async (pollId) => {
    try {
      await clonePoll(pollId);
      showMessage("Poll cloned successfully", "success");
      if (selectedBusiness) {
        fetchPolls(selectedBusiness, selectedStatus);
      }
    } catch (err) {
      showMessage("Failed to clone poll", "error");
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar Drawer for Business */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 320, p: 2, bgcolor: "background.default" } }}
      >
        <Stack spacing={2} sx={{ height: "100%" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight="bold">
              Select Business
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <Divider />

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
                textAlign="center"
                mt={4}
                variant="body2"
                color="text.secondary"
              >
                No businesses found.
              </Typography>
            )}
          </Box>
        </Stack>
      </Drawer>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ p: 4, flexGrow: 1 }}>
        <BreadcrumbsNav />

        {/* Top Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "left" }}
          spacing={2}
          mb={2}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Manage Polls
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Select a business to view and manage its polls.
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

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditPoll(null);
                setOpenDrawer(true);
              }}
              sx={{
                minWidth: { xs: "100%", sm: "auto" },
                fontWeight: "bold",
                fontSize: "1rem",
                py: 1.5,
              }}
            >
              Create Poll
            </Button>
          </Stack>
        </Stack>

        <Divider sx={{ mb: 4 }} />

        {/* Polls Display */}
        {loading ? (
          <Box
            minHeight="40vh"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <CircularProgress />
          </Box>
        ) : (
          <Grid
            container
            spacing={3}
            justifyContent={{ xs: "center", sm: "flex-start" }}
          >
            {polls.map((poll) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={poll._id}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Card
                  elevation={3}
                  sx={{
                    width: "350px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        <PollIcon />
                      </Avatar>
                    }
                    title={poll.question}
                    subheader={poll.business?.name || "No business"}
                    action={
                      <Chip
                        label={poll.status}
                        color={poll.status === "active" ? "success" : "default"}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    }
                  />
                  <CardContent>
                    <Stack spacing={1}>
                      {poll.options.map((opt, idx) => (
                        <Stack
                          key={idx}
                          direction="row"
                          spacing={1}
                          alignItems="center"
                        >
                          {opt.imageUrl && (
                            <Avatar
                              src={opt.imageUrl}
                              alt={`Option ${idx + 1}`}
                              variant="rounded"
                              sx={{ width: 40, height: 40 }}
                            />
                          )}
                          <Typography variant="body2" color="text.secondary">
                            {opt.text}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "flex-end" }}>
                    <Tooltip title="Clone">
                      <IconButton
                        color="secondary"
                        onClick={() => handleClone(poll._id)}
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setEditPoll(poll);
                          setOpenDrawer(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() =>
                          setConfirmDelete({ open: true, id: poll._id })
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Share Poll Link">
                      <IconButton
                        color="info"
                        onClick={() => {
                          setSharePoll(poll);
                          setShareOpen(true);
                        }}
                      >
                        <ShareIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Create/Edit Poll Drawer */}
        <PollFormDrawer
          open={openDrawer}
          onClose={() => {
            setOpenDrawer(false);
            setEditPoll(null);
          }}
          onSubmit={handleSubmit}
          initialValues={editPoll}
          businesses={businesses}
        />

        {/* Delete Poll Dialog */}
        <ConfirmationDialog
          open={confirmDelete.open}
          onClose={() => setConfirmDelete({ open: false, id: null })}
          onConfirm={handleDelete}
          title="Delete Poll"
          message="Are you sure you want to delete this poll? This action cannot be undone."
          confirmButtonText="Delete"
        />

        {/* Share Modal */}
        <SharePollModal
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          poll={sharePoll}
        />
      </Container>
    </Box>
  );
}
