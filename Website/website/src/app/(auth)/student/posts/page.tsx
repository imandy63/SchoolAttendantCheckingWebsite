"use client";
import { getPostsAPI } from "@/api/api.post";
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
  const [filteredData, setFilteredData] = useState<Post[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedPost, setSelectedPost] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPostsAPI(1);
        setData([...response.data]);
        setFilteredData([...response.data]); // Initialize filtered data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    const results = data.filter((post) =>
      post.post_title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(results);
  };

  return (
    <div className="bg-white shadow p-4 rounded-lg">
      <h2 className="text-xl font-semibold border-b py-2 text-blue-800">
        THÔNG BÁO CHUNG
      </h2>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm thông báo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow p-2 border rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Tìm kiếm
        </button>
      </div>

      <ul className="divide-y divide-gray-300">
        {filteredData.map((post) => (
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
        {filteredData.length === 0 && (
          <p className="text-center text-gray-500">
            Không tìm thấy thông báo nào
          </p>
        )}
        {isOpen && (
          <PostPopup
            closeModal={() => {
              setSelectedPost("");
              setIsOpen(false);
            }}
            postId={selectedPost}
            showPreview={isOpen}
          />
        )}
      </ul>
    </div>
  );
};

export default PostPage;
