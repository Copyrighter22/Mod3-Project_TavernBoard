// -----------------------------------------------------------------------------
// SERVICIOS PARA LA GESTIÓN DE COMENTARIOS
// -----------------------------------------------------------------------------
import API from "./api";

export const getCommentsByPost = async (postId) => {
  const response = await API.get(`/comments/post/${postId}`);
  return response.data;
};

export const createComment = async (postId, content) => {
  const response = await API.post(`/comments/post/${postId}`, { content });
  return response.data;
};

export const deleteComment = async (commentId) => {
  const response = await API.delete(`/comments/${commentId}`);
  return response.data;
};
