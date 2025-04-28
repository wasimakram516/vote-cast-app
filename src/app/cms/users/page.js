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
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Chip,
  CardActions,
  IconButton,
  Divider,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMessage } from "@/app/context/MessageContext";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/app/services/userService";
import UserFormModal from "@/app/components/UserFormModal";
import ConfirmationDialog from "@/app/components/ConfirmationDialog";
import BreadcrumbsNav from "@/app/components/BreadcrumbsNav";
import { formatDate } from "@/app/utils/formatDate";

export default function UsersPage() {
  const { showMessage } = useMessage();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch {
      showMessage("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (formData, id = null) => {
    try {
      if (id) {
        await updateUser(id, formData);
        showMessage("User updated successfully", "success");
      } else {
        await createUser(formData);
        showMessage("User created successfully", "success");
      }
      fetchUsers();
      setOpenForm(false);
      setEditUser(null);
    } catch (err) {
      showMessage(
        err?.response?.data?.message || "Failed to save user",
        "error"
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(confirmDelete.id);
      showMessage("User deleted successfully", "success");
      fetchUsers();
    } catch (err) {
      showMessage(
        err?.response?.data?.message || "Failed to delete user",
        "error"
      );
    } finally {
      setConfirmDelete({ open: false, id: null });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <BreadcrumbsNav />

      {/* ✅ Header Section */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        mb={2}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            User Management
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Create, edit, or remove users who can manage businesses.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => {
            setEditUser(null);
            setOpenForm(true);
          }}
          sx={{
            minWidth: { xs: "100%", sm: "auto" },
            fontWeight: "bold",
            fontSize: "1rem",
            py: 1.5,
          }}
        >
          Create User
        </Button>
      </Stack>

      {/* Divider */}
      <Divider sx={{ mb: 4 }} />

      {/* ✅ Users Grid */}
      {loading ? (
        <Box
          minHeight="40vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <CircularProgress />
        </Box>
      ) : (
        <Grid
          container
          spacing={3}
          justifyContent={{ xs: "center", sm: "flex-start" }}
        >
          {users.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user._id}>
              <Card
                elevation={4}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderRadius: 3,
                  p: 2,
                }}
              >
                {/* Card Header */}
                <CardHeader
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {user.name?.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  title={
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ fontSize: "1.1rem" }}
                    >
                      {user.name}
                    </Typography>
                  }
                  subheader={
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {user.email}
                    </Typography>
                  }
                  action={
                    <Chip
                      label={user.role}
                      color={
                        user.role === "admin" || user.role === "superadmin"
                          ? "warning"
                          : "primary"
                      }
                      size="small"
                      sx={{
                        fontWeight: "bold",
                        letterSpacing: 0.5,
                        mt: 1,
                        mr: 1,
                      }}
                    />
                  }
                  sx={{
                    alignItems: "center",
                    pb: 1,
                  }}
                />

                {/* Card Content */}
                <CardContent sx={{ flexGrow: 1, pt: 0 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontStyle="italic"
                  >
                    Created on: {formatDate(user.createdAt)}
                  </Typography>
                </CardContent>

                {/* Card Actions */}
                <CardActions
                  sx={{
                    justifyContent: "flex-end",
                    mt: 1,
                    pt: 0,
                  }}
                >
                  <IconButton
                    color="info"
                    onClick={() => {
                      setEditUser(user);
                      setOpenForm(true);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() =>
                      setConfirmDelete({ open: true, id: user._id })
                    }
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* ✅ Create / Edit Modal */}
      <UserFormModal
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditUser(null);
        }}
        onSubmit={handleSubmit}
        initialValues={editUser || {}}
      />

      {/* ✅ Delete Confirmation */}
      <ConfirmationDialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmButtonText="Delete"
      />
    </Container>
  );
}
