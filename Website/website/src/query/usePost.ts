import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllPostsAPI,
  getPostDetailsAPI,
  createPostAPI,
  updatePostAPI,
  deletePostAPI,
  restorePostAPI,
} from "@/api/api.post";
import { POST, POSTS } from "@/constants/query";

export const useGetAllPosts = (page: number, search: string) => {
  return useQuery({
    queryKey: [POSTS, page, search],
    queryFn: () => getAllPostsAPI(page, search),
  });
};

export const useGetPostDetails = (id: string) => {
  return useQuery({
    queryKey: [POST, id],
    queryFn: () => getPostDetailsAPI(id),
    enabled: !!id,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPostAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [POSTS] });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePostAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [POSTS] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePostAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [POSTS] });
    },
  });
};

export const useRestorePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: restorePostAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [POSTS] });
    },
  });
};
