import API from "./api";

export const getMyProfile = async () => {
  const response = await API.get("/users/me");
  return response.data;
};
