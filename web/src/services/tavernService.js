import API from "./api";

export const getTaverns = async () => {
  const response = await API.get("/taverns");
  return response.data;
};

export const getTavernById = async (tavernId) => {
  const response = await API.get(`/taverns/${tavernId}`);
  return response.data;
};

export const createTavern = async (tavernData) => {
  const response = await API.post("/taverns", tavernData);
  return response.data;
};

export const toggleJoinTavern = async (tavernId) => {
  const response = await API.put(`/taverns/${tavernId}/join`);
  return response.data;
};
