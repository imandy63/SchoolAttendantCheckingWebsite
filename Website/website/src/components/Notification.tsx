import { getTop5LatestPostsAPI } from "@/api/api.post";
import { formatDate } from "@/utils/formatDate";
import { useEffect, useState } from "react";

interface Post {
  post_title: string;
  _id: string;
  post_author: string;
  post_content: string;
  post_date: string;
}

export const Notification = () => {
  const [data, setData] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTop5LatestPostsAPI();
        console.log(response);
        setData([...response]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="bg-white shadow p-4 rounded-lg">
      <h2 className="text-xl font-semibold text-blue-800 mb-4">
        THÔNG BÁO CHUNG
      </h2>
      <ul className="divide-y divide-gray-300">
        {data.map((post) => (
          <li key={post._id} className="py-4">
            <h2 className="text-lg font-semibold text-blue-600">
              {post.post_title}
            </h2>
            <p className="text-sm text-gray-500">
              <p className="font-medium text-gray-700">{post.post_author}</p>
              <p>{formatDate(post.post_date)}</p>
            </p>
            <a
              href="#"
              className="mt-2 inline-block text-red-500 hover:underline"
            >
              Xem chi tiết
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
