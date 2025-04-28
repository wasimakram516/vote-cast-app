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
  Divider,
} from "@mui/material";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import { useMessage } from "@/app/context/MessageContext";
import {
  getBusinesses,
  createBusiness,
  updateBusiness,
  deleteBusiness,
} from "@/app/services/businessService";
import { getUsers } from "@/app/services/userService";
import BusinessFormModal from "@/app/components/BusinessFormModal";
import ConfirmationDialog from "@/app/components/ConfirmationDialog";
import BreadcrumbsNav from "@/app/components/BreadcrumbsNav";
import { useAuth } from "@/app/context/AuthContext";
import { formatDate } from "@/app/utils/formatDate";
import BusinessCard from "@/app/components/BusinessCard";

export default function ManageBusinessesPage() {
  const { user } = useAuth();
  const { showMessage } = useMessage();

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editBusiness, setEditBusiness] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const [userList, setUserList] = useState([]);

  const isAdmin = ["admin", "superadmin"].includes(user?.role);

  const fetchBusinesses = async () => {
    try {
      const data = await getBusinesses();
      setBusinesses(data);
    } catch {
      showMessage("Failed to load businesses", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (!isAdmin) return;
    try {
      const data = await getUsers();
      setUserList(data);
    } catch {
      showMessage("Failed to load users", "error");
    }
  };

  useEffect(() => {
    fetchBusinesses();
    fetchUsers();
  }, []);

  const handleSubmit = async (formData, id = null) => {
    try {
      if (id) {
        await updateBusiness(id, formData);
        showMessage("Business updated successfully", "success");
      } else {
        await createBusiness(formData);
        showMessage("Business created successfully", "success");
      }
      fetchBusinesses();
      setOpenForm(false);
      setEditBusiness(null);
    } catch {
      showMessage("Failed to save business", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBusiness(confirmDelete.id);
      showMessage("Business deleted successfully", "success");
      fetchBusinesses();
    } catch (err) {
      showMessage(
        err?.response?.data?.message || "Failed to delete business",
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
            Business Management
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            View, create, and manage your businesses here.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddBusinessIcon />}
          onClick={() => {
            setEditBusiness(null);
            setOpenForm(true);
          }}
          sx={{
            minWidth: { xs: "100%", sm: "auto" },
            fontWeight: "bold",
            fontSize: "1rem",
            py: 1.5,
          }}
        >
          Create Business
        </Button>
      </Stack>

      {/* Divider */}
      <Divider sx={{ mb: 4 }} />

      {/* ✅ Businesses List */}
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
          {businesses.map((business) => (
            <Grid item xs={12} sm={6} md={4} key={business._id}>
              <BusinessCard
                business={business}
                setEditBusiness={setEditBusiness}
                setOpenForm={setOpenForm}
                setConfirmDelete={setConfirmDelete}
                formatDate={formatDate}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* ✅ Create / Edit Modal */}
      <BusinessFormModal
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditBusiness(null);
        }}
        onSubmit={handleSubmit}
        initialValues={editBusiness}
        userList={userList}
      />

      {/* ✅ Delete Confirmation */}
      <ConfirmationDialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Business"
        message="Are you sure you want to delete this business? This action cannot be undone."
        confirmButtonText="Delete"
      />
    </Container>
  );
}
