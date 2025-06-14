"use client";

import {
  Box,
  Container,
  Typography,
  IconButton,
  Tooltip,
  Stack,
  Divider,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import { useEffect, useState } from "react";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import BreadcrumbsNav from "@/app/components/BreadcrumbsNav";
import { useMessage } from "@/app/context/MessageContext";
import { getBusinesses } from "@/app/services/businessService";

export default function LinkSharingPage() {
  const { showMessage } = useMessage();
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const data = await getBusinesses();
        setBusinesses(data);
      } catch (error) {
        showMessage("Failed to fetch businesses", "error");
      }
    };
    fetchBusinesses();
  }, []);

  const handleCopy = (slug) => {
    const fullUrl = `${window.location.origin}/queries/${slug}/qr`;
    navigator.clipboard.writeText(fullUrl);
    showMessage("Public QR page link copied to clipboard!", "success");
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <BreadcrumbsNav />

      <Stack spacing={2} mb={4}>
        <Typography variant="h4" fontWeight="bold">
          Public QR Code Links for Visitor Questions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Copy the business-specific link below and open it on any public screen.
          Visitors can scan the QR code shown on that page to submit or vote on questions.
        </Typography>
        <Divider sx={{ mt: 2 }} />
      </Stack>

      <Stack spacing={3}>
        {businesses.length === 0 ? (
          <Typography>No businesses found.</Typography>
        ) : (
          businesses.map((business) => {
            const qrUrl = `${window.location.origin}/queries/${business.slug}/qr`;

            return (
              <Card key={business._id} variant="outlined">
                <CardHeader
                  title={
                    <Typography fontWeight="bold">{business.name}</Typography>
                  }
                  action={
                    <Tooltip title="Copy public QR page link">
                      <IconButton
                        size="small"
                        onClick={() => handleCopy(business.slug)}
                        aria-label="Copy link"
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  }
                  sx={{ pb: 0 }}
                />
                <CardContent>
                  <Stack spacing={1} mt={1}>
                    {business.contactEmail && (
                      <Box display="flex" alignItems="center" gap={1}>
                        <EmailIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {business.contactEmail}
                        </Typography>
                      </Box>
                    )}
                    {business.contactPhone && (
                      <Box display="flex" alignItems="center" gap={1}>
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {business.contactPhone}
                        </Typography>
                      </Box>
                    )}
                    {business.address && (
                      <Box display="flex" alignItems="center" gap={1}>
                        <LocationOnIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {business.address}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            );
          })
        )}
      </Stack>
    </Container>
  );
}
