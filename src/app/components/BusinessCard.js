"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Stack,
  Tooltip,
  Divider,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useAuth } from "@/app/context/AuthContext"; // ✅

export default function BusinessCard({
  business,
  setEditBusiness,
  setOpenForm,
  setConfirmDelete,
  formatDate,
}) {
  const { user } = useAuth(); // ✅ get current logged-in user
  const isAdmin = ["admin", "superadmin"].includes(user?.role);

  return (
    <Card
      elevation={3}
      sx={{
        maxWidth: 320,
        borderRadius: 3,
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Stack spacing={2}>
        <CardHeader
          avatar={
            business.logoUrl ? (
              <Avatar
                src={business.logoUrl}
                alt={business.name}
                variant="rounded"
                sx={{ width: 56, height: 56 }}
              />
            ) : (
              <Avatar
                variant="rounded"
                sx={{
                  bgcolor: "grey.200",
                  color: "primary.main",
                  width: 56,
                  height: 56,
                }}
              >
                <BusinessIcon />
              </Avatar>
            )
          }
          title={
            <Typography variant="h6" fontWeight="bold">
              {business.name}
            </Typography>
          }
          subheader={
            <Stack spacing={0.3}>
              <Typography variant="caption" color="text.secondary">
                {business.slug}
              </Typography>
              {isAdmin && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontStyle="italic"
                >
                  Owner: {business.owner?.name || "N/A"}
                </Typography>
              )}
            </Stack>
          }
          sx={{ p: 0 }}
        />

        <Divider />

        <CardContent sx={{ p: 0 }}>
          <Stack spacing={1}>
            <InfoRow icon={<EmailIcon fontSize="small" />} value={business.contactEmail} />
            <InfoRow icon={<PhoneIcon fontSize="small" />} value={business.contactPhone} />
            <InfoRow icon={<LocationOnIcon fontSize="small" />} value={business.address} />
            <InfoRow icon={<AccessTimeIcon fontSize="small" />} value={formatDate(business.createdAt)} />
          </Stack>
        </CardContent>

        <Divider />

        <CardActions sx={{ justifyContent: "flex-end", p: 0, pt: 1 }}>
          <Tooltip title="Edit">
            <IconButton
              color="primary"
              onClick={() => {
                setEditBusiness(business);
                setOpenForm(true);
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              color="error"
              onClick={() =>
                setConfirmDelete({ open: true, id: business._id })
              }
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Stack>
    </Card>
  );
}

function InfoRow({ icon, value }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {icon}
      <Typography
        variant="body2"
        color="text.primary"
        sx={{ wordBreak: "break-word" }}
      >
        {value || "N/A"}
      </Typography>
    </Stack>
  );
}
