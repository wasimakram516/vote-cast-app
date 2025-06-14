import api from "./api";

export const getVisitors = async () => {
  const { data } = await api.get("/visitors");
  return data.data;
};
