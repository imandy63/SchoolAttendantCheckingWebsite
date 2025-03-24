import { urlConfig } from "@/configs/config.url";
import axiosInstance from ".";
import { PostCreate } from "@/interfaces/post.interface";

export const getPostsAPI = async (page: number, search = "") => {
  const response = await axiosInstance.get(
    `${urlConfig.CORE}/api/post?page=${page}&search=${search}`
  );
  return response.data.metadata;
};

export const getTop5LatestPostsAPI = async () => {
  const response = await axiosInstance.get(
    `${urlConfig.CORE}/api/post/top-5-latest`
  );
  return response.data.metadata;
};

export const getAllPostsAPI = async (page: number, search = "") => {
  const response = await axiosInstance.get(
    `${urlConfig.CORE}/api/post/all?page=${page}&search=${search}`
  );
  return response.data.metadata;
};

export const getPostDetailsAPI = async (id: string) => {
  const response = await axiosInstance.get(`${urlConfig.CORE}/api/post/${id}`);
  return response.data.metadata;
};

export const createPostAPI = async ({
  post_author,
  post_contents,
  post_title,
}: PostCreate) => {
  const response = await axiosInstance.post(`${urlConfig.CORE}/api/post`, {
    post_author,
    post_contents,
    post_title,
  });
  return response.data.metadata;
};

export const updatePostAPI = async ({
  post_author,
  post_contents,
  post_title,
  post_id,
}: PostCreate & { post_id: string }) => {
  const response = await axiosInstance.put(
    `${urlConfig.CORE}/api/post/${post_id}`,
    {
      post_author,
      post_contents,
      post_title,
    }
  );
  return response.data.metadata;
};

export const deletePostAPI = async (post_id: string) => {
  const response = await axiosInstance.delete(
    `${urlConfig.CORE}/api/post/${post_id}`
  );
  return response.data.metadata;
};

export const restorePostAPI = async (post_id: string) => {
  const response = await axiosInstance.put(
    `${urlConfig.CORE}/api/post/restore/${post_id}`
  );
  return response.data.metadata;
};
