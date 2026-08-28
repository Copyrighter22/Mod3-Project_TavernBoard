import API from "./api";

export const getPosts = async () => {
  const response = await API.get("/posts");
  return response.data;
};

export const createPost = async (postData) => {
  const response = await API.post("/posts", postData);
  return response.data;
};

export const deletePost = async (postId) => {
  const response = await API.delete(`/posts/${postId}`);
  return response.data;
};

export const toggleLike = async (postId) => {
  const response = await API.put(`/posts/${postId}/like`);
  return response.data;
};

export const getPostsByTavern = async (tavernId) => {
  const response = await API.get(`/posts/tavern/${tavernId}`);
  return response.data;
};

export const getJoinedPosts = async () => {
  const response = await API.get("/posts/feed");
  return response.data;
};
