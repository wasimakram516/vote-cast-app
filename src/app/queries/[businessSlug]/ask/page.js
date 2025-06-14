"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Divider,
} from "@mui/material";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";

import { useParams } from "next/navigation";
import {
  getQuestions,
  voteQuestion,
  postQuestion,
} from "@/app/services/questionService";
import { useMessage } from "@/app/context/MessageContext";
import Image from "next/image";

export default function AskQuestionsPage() {
  const { businessSlug } = useParams();
  const { showMessage } = useMessage();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    company: "",
    text: "",
  });

  const fetchQuestions = async () => {
    try {
      const data = await getQuestions(businessSlug);
      setQuestions(data);
    } catch (error) {
      showMessage("Failed to load questions", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (questionId) => {
    const voted = JSON.parse(localStorage.getItem("votedQuestions") || "[]");
    const hasVoted = voted.includes(questionId);

    const action = hasVoted ? "remove" : "add";
    await voteQuestion(questionId, action);

    const updated = hasVoted
      ? voted.filter((id) => id !== questionId)
      : [...voted, questionId];

    localStorage.setItem("votedQuestions", JSON.stringify(updated));
    fetchQuestions();
  };

  const handleSubmit = async () => {
    const { name, text } = formData;
    if (!name || !text) {
      showMessage("Name and Question are required.", "warning");
      return;
    }
    try {
      await postQuestion(businessSlug, formData);
      showMessage("Question submitted!", "success");
      setFormData({ name: "", phone: "", company: "", text: "" });
      setOpenForm(false);
      fetchQuestions();
    } catch {
      showMessage("Failed to submit question", "error");
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [businessSlug]);

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "100vh",
        px: { xs: 2, sm: 4 },
        pt: 12,
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
      
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Ask a Question
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Scan the QR and post your question, or vote on existing ones.
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          onClick={() => setOpenForm(true)}
        >
          Post New Question
        </Button>
      </Box>

      {/* Questions List */}
      {loading ? (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={2}>
          {questions.length === 0 ? (
            <Typography color="text.secondary">No questions yet.</Typography>
          ) : (
            questions.map((q) => {
              const votedQuestions = JSON.parse(
                localStorage.getItem("votedQuestions") || "[]"
              );
              const hasVoted = votedQuestions.includes(q._id);

              return (
                <Card key={q._id} variant="outlined">
                  <CardContent>
                    {/* Question text */}
                    <Typography fontWeight="bold" gutterBottom>
                      {q.text}
                    </Typography>

                    {/* Visitor Info with Icons */}
                    <Stack spacing={0.5} mb={1}>
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

                    {/* Voting */}
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      mt={1}
                    >
                      <IconButton
                        onClick={() => handleVote(q._id)}
                        color="primary"
                      >
                        {hasVoted ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />}
                      </IconButton>
                      <Typography>{q.votes}</Typography>
                    </Stack>
                  </CardContent>
                </Card>
              );
            })
          )}
        </Stack>
      )}

      {/* Question Form Modal */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: 6,
          },
        }}
      >
        <DialogTitle fontWeight="bold" sx={{ pb: 1 }}>
          Submit a Question
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Your Name *"
                fullWidth
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone"
                fullWidth
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Company"
                fullWidth
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Your Question *"
                fullWidth
                multiline
                minRows={3}
                value={formData.text}
                onChange={(e) =>
                  setFormData({ ...formData, text: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpenForm(false)}
            variant="outlined"
            color="error"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            sx={{ minWidth: 120 }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
