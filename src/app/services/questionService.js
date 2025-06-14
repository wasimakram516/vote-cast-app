import api from "./api";

// Public
export const getQuestions = async (businessSlug) => {
  const { data } = await api.get(`/questions/slug/${businessSlug}`);
  return data.data;
};

export const postQuestion = async (businessSlug, questionData) => {
  const { data } = await api.post(`/questions/slug/${businessSlug}`, questionData);
  return data.data;
};

export const voteQuestion = async (questionId, action) => {
  const { data } = await api.put(`/questions/${questionId}/vote`, { action });
  return data.data;
};

// Admin/CMS
export const updateQuestion = async (questionId, updateData) => {
  const { data } = await api.put(`/questions/${questionId}`, updateData);
  return data.data;
};

export const deleteQuestion = async (questionId) => {
  const { data } = await api.delete(`/questions/${questionId}`);
  return data.data;
};
