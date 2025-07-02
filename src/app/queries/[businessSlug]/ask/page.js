"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  Grid,
  CardContent,
  Stack,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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
import Footer from "@/app/components/Footer";
import LanguageSelector from "@/app/components/LanguageSelector";
import { useLanguage } from "@/app/context/LanguageContext";

export default function AskQuestionsPage() {
  const { language } = useLanguage();
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

  const isArabic = language === "ar";
  const dir = isArabic ? "rtl" : "ltr";
  const align = isArabic ? "right" : "left";

  const translations = {
    en: {
      ask: "Ask a Question",
      description:
        "Scan the QR and post your question, or vote on existing ones.",
      postNew: "Post New Question",
      noQuestions: "No questions yet.",
      nameRequired: "Name and Question are required.",
      submitted: "Question submitted!",
      failedSubmit: "Failed to submit question",
      formTitle: "Submit a Question",
      nameLabel: "Your Name *",
      phoneLabel: "Phone",
      companyLabel: "Company",
      questionLabel: "Your Question *",
      cancel: "Cancel",
      submit: "Submit",
      anonymous: "Anonymous",
      notProvided: "Not provided",
      failedLoad: "Failed to load questions",
    },
    ar: {
      ask: "اطرح سؤالاً",
      description:
        "امسح رمز QR ضوئيًا لطرح سؤالك أو التصويت على الأسئلة الموجودة.",
      postNew: "أضف سؤالًا جديدًا",
      noQuestions: "لا توجد أسئلة بعد.",
      nameRequired: "الاسم والسؤال مطلوبان.",
      submitted: "تم إرسال السؤال!",
      failedSubmit: "فشل في إرسال السؤال",
      formTitle: "أرسل سؤالاً",
      nameLabel: "اسمك *",
      phoneLabel: "الهاتف",
      companyLabel: "الشركة",
      questionLabel: "سؤالك *",
      cancel: "إلغاء",
      submit: "إرسال",
      anonymous: "مجهول",
      notProvided: "غير متوفر",
      failedLoad: "فشل في تحميل الأسئلة",
    },
  };

  const fetchQuestions = async () => {
    try {
      const data = await getQuestions(businessSlug);
      setQuestions(data);
    } catch {
      showMessage(translations[language].failedLoad, "error");
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
      showMessage(translations[language].nameRequired, "warning");
      return;
    }
    try {
      await postQuestion(businessSlug, formData);
      showMessage(translations[language].submitted, "success");
      setFormData({ name: "", phone: "", company: "", text: "" });
      setOpenForm(false);
      fetchQuestions();
    } catch {
      showMessage(translations[language].failedSubmit, "error");
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [businessSlug]);

  return (
    <Container
      dir={dir}
      sx={{
        textAlign: align,
        minHeight: "100vh",
        position: "relative",
        overflowY: "auto",
        px: { xs: 2, sm: 4 },
        pt: 10,
        mb: 10,
      }}
    >
      <LanguageSelector />

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "center", sm: "space-between" },
          alignItems: { xs: "center", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 4,
          textAlign: { xs: "center", sm: align },
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {translations[language].ask}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {translations[language].description}
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="large"
          onClick={() => setOpenForm(true)}
          sx={{
            alignSelf: { xs: "stretch", sm: "auto" },
          }}
        >
          {translations[language].postNew}
        </Button>
      </Box>

      {/* Questions */}
      {loading ? (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={2}>
          {questions.length === 0 ? (
            <Typography color="text.secondary">
              {translations[language].noQuestions}
            </Typography>
          ) : (
            questions.map((q) => {
              const votedQuestions = JSON.parse(
                localStorage.getItem("votedQuestions") || "[]"
              );
              const hasVoted = votedQuestions.includes(q._id);
              return (
                <Card key={q._id} variant="outlined">
                  <CardContent>
                    {/* Question Text */}
                    <Typography fontWeight="bold" gutterBottom>
                      {q.text}
                    </Typography>

                    {/* Visitor Info — Fixed 3 Columns with Wrapping Text */}
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      mb={1}
                      sx={{ flexWrap: "nowrap", gap: 2 }}
                    >
                      {[
                        {
                          icon: <PersonIcon fontSize="small" color="action" />,
                          text:
                            q.visitor?.name || translations[language].anonymous,
                        },
                        {
                          icon: <PhoneIcon fontSize="small" color="action" />,
                          text:
                            q.visitor?.phone ||
                            translations[language].notProvided,
                        },
                        {
                          icon: (
                            <BusinessIcon fontSize="small" color="action" />
                          ),
                          text:
                            q.visitor?.company ||
                            translations[language].notProvided,
                        },
                      ].map((item, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: "33.33%",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "flex-start",
                            gap: 1,
                            wordBreak: "break-word",
                            whiteSpace: "normal",
                          }}
                        >
                          {item.icon}
                          <Typography variant="body2">{item.text}</Typography>
                        </Box>
                      ))}
                    </Box>

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

      {/* Modal */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: 6,
            textAlign: { xs: "center", sm: align },
          },
        }}
      >
        <DialogTitle
          fontWeight="bold"
          sx={{
            textAlign: { xs: "center", sm: align },
            pb: 1,
          }}
        >
          {translations[language].formTitle}
        </DialogTitle>

        <DialogContent>
          <Stack
            spacing={2}
            sx={{
              alignItems: { xs: "center", sm: "stretch" },
              mb: 2,
            }}
          >
            <TextField
              label={translations[language].nameLabel}
              fullWidth
              value={formData.name}
              sx={{ mt: 4 }}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <TextField
              label={translations[language].phoneLabel}
              fullWidth
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            <TextField
              label={translations[language].companyLabel}
              fullWidth
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
            />
            <TextField
              label={translations[language].questionLabel}
              fullWidth
              multiline
              minRows={5}
              value={formData.text}
              onChange={(e) =>
                setFormData({ ...formData, text: e.target.value })
              }
            />
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2,
            justifyContent: { xs: "center", sm: "flex-end" }, 
          }}
        >
          <Button
            onClick={() => setOpenForm(false)}
            variant="outlined"
            color="error"
          >
            {translations[language].cancel}
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            sx={{ minWidth: 120 }}
          >
            {translations[language].submit}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Container>
  );
}
