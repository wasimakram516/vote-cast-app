"use client";

import {
  Box,
  Container,
  Typography,
  Stack,
  Divider,
  IconButton,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Tooltip,
  CircularProgress,
  Drawer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import BreadcrumbsNav from "@/app/components/BreadcrumbsNav";
import { useEffect, useState } from "react";
import { useMessage } from "@/app/context/MessageContext";
import { getBusinesses } from "@/app/services/businessService";
import {
  getQuestions,
  updateQuestion,
  deleteQuestion,
} from "@/app/services/questionService";
import ConfirmationDialog from "@/app/components/ConfirmationDialog";

export default function ManageQuestionsPage() {
  const { showMessage } = useMessage();

  const [businesses, setBusinesses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  const fetchBusinesses = async () => {
    try {
      const data = await getBusinesses();
      setBusinesses(data);
    } catch {
      showMessage("Failed to load businesses", "error");
    }
  };

  const fetchQuestions = async (slug) => {
    try {
      setLoading(true);
      const data = await getQuestions(slug);
      setQuestions(data);
    } catch {
      showMessage("Failed to load questions", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessSelect = (slug) => {
    setSelectedBusiness(slug);
    fetchQuestions(slug);
    setDrawerOpen(false);
  };

  const handleDelete = async () => {
    try {
      await deleteQuestion(confirmDelete.id);
      showMessage("Question deleted", "success");
      fetchQuestions(selectedBusiness);
    } catch {
      showMessage("Failed to delete question", "error");
    } finally {
      setConfirmDelete({ open: false, id: null });
    }
  };

  const handleEditSubmit = async () => {
    if (!editData?.text) {
      showMessage("Question cannot be empty", "warning");
      return;
    }
    try {
      await updateQuestion(editData._id, { text: editData.text });
      showMessage("Question updated", "success");
      fetchQuestions(selectedBusiness);
      setEditDialogOpen(false);
    } catch {
      showMessage("Failed to update question", "error");
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

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
              businesses.map((b) => (
                <Accordion key={b._id} disableGutters elevation={0}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ px: 2, py: 1 }}
                  >
                    <Typography fontWeight="bold">{b.name}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={1}>
                      <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        onClick={() => handleBusinessSelect(b.slug)}
                      >
                        Load Questions
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="success"
                        fullWidth
                        onClick={() =>
                          window.open(`/queries/${b.slug}/display`, "_blank")
                        }
                      >
                        Open Full Screen
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

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
          mb={2}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Manage Questions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Select a business to review and moderate questions submitted by
              visitors.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={() => setDrawerOpen(true)}
            sx={{ fontWeight: "bold", py: 1.5 }}
          >
            Select Business
          </Button>
        </Stack>

        <Divider sx={{ mb: 4 }} />

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="40vh"
          >
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {questions.map((q) => (
              <Grid item xs={12} sm={6} md={4} key={q._id}>
                <Card
  variant="outlined"
  sx={{
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    width:"300px",
    borderRadius: 3,
    boxShadow: 1,
    bgcolor: "#fefefe",
    px: 1,
    py: 1.5,
  }}
>
  <CardContent>
      {/* Question Text */}
      <Typography
        fontWeight="bold"
        fontSize="1.05rem"
        color="text.primary"
        sx={{ lineHeight: 1.4 }}
      >
        {q.text}
      </Typography>
  </CardContent>

  {/* ✅ Visitor Info & Actions Grouped Together */}
  <Box
    sx={{
      px: 2,
      pb: 2,
      display: "flex",
      flexDirection: "column",
      gap: 1,
    }}
  >
    {/* Votes + Answered Toggle */}
    <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <ThumbUpIcon fontSize="small" color="primary" />
          <Typography variant="body2" color="text.secondary">
            {q.votes} vote{q.votes !== 1 ? "s" : ""}
          </Typography>
        </Stack>

        <Tooltip title={q.answered ? "Mark as Unanswered" : "Mark as Answered"}>
          <IconButton
            onClick={async () => {
              try {
                await updateQuestion(q._id, { answered: !q.answered });
                fetchQuestions(selectedBusiness);
              } catch {
                showMessage("Failed to update answered status", "error");
              }
            }}
            color={q.answered ? "success" : "default"}
            size="small"
          >
            {q.answered ? <CheckCircleIcon /> : <CheckCircleOutlineIcon />}
          </IconButton>
        </Tooltip>
      </Stack>
    <Divider sx={{ my: 1 }} />

    <Stack spacing={0.5}>
      <Stack direction="row" spacing={1} alignItems="center">
        <PersonIcon fontSize="small" color="action" />
        <Typography variant="body2">
          {q.visitor?.name || "Anonymous"}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <PhoneIcon fontSize="small" color="action" />
        <Typography variant="body2">
          {q.visitor?.phone || "Not provided"}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <BusinessIcon fontSize="small" color="action" />
        <Typography variant="body2">
          {q.visitor?.company || "Not provided"}
        </Typography>
      </Stack>
    </Stack>

    {/* Actions */}
    <Stack direction="row" spacing={1} justifyContent="flex-end" mt={1}>
      <Tooltip title="Edit Question">
        <IconButton
          onClick={() => {
            setEditData(q);
            setEditDialogOpen(true);
          }}
          color="primary"
          size="small"
        >
          <EditIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Delete Question">
        <IconButton
          onClick={() => setConfirmDelete({ open: true, id: q._id })}
          color="error"
          size="small"
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  </Box>
</Card>

              </Grid>
            ))}
          </Grid>
        )}

        {/* ✅ Edit Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Edit Question</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Question Text"
              multiline
              minRows={3}
              value={editData?.text || ""}
              onChange={(e) =>
                setEditData({ ...editData, text: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => setEditDialogOpen(false)}
              color="error"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} variant="contained">
              Update
            </Button>
          </DialogActions>
        </Dialog>

        {/* ✅ Delete Dialog */}
        <ConfirmationDialog
          open={confirmDelete.open}
          onClose={() => setConfirmDelete({ open: false, id: null })}
          onConfirm={handleDelete}
          title="Delete Question"
          message="Are you sure you want to delete this question?"
          confirmButtonText="Delete"
        />
      </Container>
    </Box>
  );
}
