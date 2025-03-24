import { getPostDetailsAPI } from "@/api/api.post";
import { Popup } from "@/app/(auth)/admin/_components/Popup";
import { formatDate } from "@/utils/formatDate";
import { useEffect, useState } from "react";

export const PostPopup = ({
  postId,
  showPreview,
  closeModal,
}: {
  postId: string;
  showPreview: boolean;
  closeModal: () => void;
}) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getPostDetailsAPI(postId).then((data) => setData(data));
  }, []);

  return (
    <Popup
      isOpen={showPreview}
      className="w-4/5 h-4/5"
      title="Bài viết"
      onClose={closeModal}
    >
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-3xl mx-auto">
        {!data ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-pulse text-gray-500">Loading...</div>
          </div>
        ) : data ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {data.post_title}
            </h2>
            <div className="text-sm text-gray-500 mb-6">
              <p>
                <span className="font-medium text-gray-600">Tác giả:</span>{" "}
                {data.post_author}
              </p>
              <p>
                <span className="font-medium text-gray-600">Ngày:</span>{" "}
                {formatDate(data.post_date)}
              </p>
            </div>
            <div className="prose max-w-none prose-blue">
              <strong className="block text-gray-700 mb-2">Nội dung:</strong>
              <div dangerouslySetInnerHTML={{ __html: data.post_contents }} />
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-full text-gray-500">
            No data available
          </div>
        )}
      </div>
    </Popup>
  );
};
