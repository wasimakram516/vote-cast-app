import api from "./api";

// ✅ Get all businesses (admin only)
export const getBusinesses = async () => {
  const { data } = await api.get("/businesses");
  return data.data;
};

// ✅ Fetch business by slug
export const getBusinessBySlug = async (slug) => {
  const { data } = await api.get(`/businesses/slug/${slug}`);
  return data.data;
};

// ✅ Create a new business (admin or business user)
export const createBusiness = async (businessData) => {
  const { data } = await api.post("/businesses", businessData);
  return data.data;
};

// ✅ Update an existing business
export const updateBusiness = async (id, updatedData) => {
  const { data } = await api.put(`/businesses/${id}`, updatedData);
  return data.data;
};

// ✅ Delete a business
export const deleteBusiness = async (id) => {
  const { data } = await api.delete(`/businesses/${id}`);
  return data.data;
};
