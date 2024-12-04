"use client";
import { getTop5LatestPostsAPI } from "@/api/api.post";
import { formatDate } from "@/utils/formatDate";
import { useEffect, useState } from "react";
import { PostPopup } from "@/components/Popup";

interface Post {
  post_title: string;
  _id: string;
  post_author: string;
  post_content: string;
  post_date: string;
}

const PostPage = () => {
  const [data, setData] = useState<Post[]>([]);
  const [seletedPost, setSelectedPost] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTop5LatestPostsAPI();
        setData([...response]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="bg-white shadow p-4 rounded-lg">
      <h2 className="text-xl font-semibold border-b py-2 text-blue-800">
        THÔNG BÁO CHUNG
      </h2>
      <ul className="divide-y divide-gray-300">
        {data.map((post) => (
          <li key={post._id} className="py-4">
            <h2
              className="text-lg font-semibold text-blue-600 cursor-pointer hover:text-blue-700 duration-300"
              onClick={() => {
                setSelectedPost(post._id);
                setIsOpen(true);
              }}
            >
              {post.post_title}
            </h2>
            <p className="text-sm text-gray-500">
              <p className="font-medium text-gray-700">{post.post_author}</p>
              <p>{formatDate(post.post_date)}</p>
            </p>
            <div
              className="flex justify-end mt-2 text-red-500 hover:underline cursor-pointer"
              onClick={() => {
                setSelectedPost(post._id);
                setIsOpen(true);
              }}
            >
              Xem chi tiết
            </div>
          </li>
        ))}
        {isOpen && (
          <PostPopup
            closeModal={() => {
              setSelectedPost("");
              setIsOpen(false);
            }}
            postId={seletedPost}
            showPreview={isOpen}
          />
        )}
      </ul>
    </div>
  );
};

export default PostPage;
