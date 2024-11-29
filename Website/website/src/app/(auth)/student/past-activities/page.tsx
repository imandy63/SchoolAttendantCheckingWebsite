"use client";
import { useGetPastActivities } from "@/query/useStudent";
import { formatDate } from "@/utils/formatDate";

const PastActivityPage = () => {
  const { data, isLoading } = useGetPastActivities();

  return (
    <>
      <div className="flex flex-col p-8 bg-[#F2F3F7]">
        <div className="px-4">
          <h2 className="text-xl font-bold text-[#0066B3]">
            Lịch sử hoạt động
          </h2>
          <p>Hiển thị danh sách lịch sử hoạt động.</p>
        </div>
      </div>
      <div className="p-4">
        <ul className="space-y-2">
          {!isLoading &&
            data &&
            data.map((activity) => {
              return (
                <li
                  key={activity._id}
                  className="flex items-center justify-between p-2 bg-white rounded shadow hover:bg-gray-50"
                >
                  <div>
                    <p className="font-semibold text-[#0066B3]">
                      {activity.activity_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {activity.activity_location} -{" "}
                      {formatDate(activity.activity_start_date)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {activity.participating_status === "participated" && (
                      <span className="text-green-500 text-sm">
                        Đã tham gia
                      </span>
                    )}
                    {activity.participating_status === "rejected" && (
                      <span className="text-red-500 text-sm">Vắng</span>
                    )}
                    {activity.participating_status === "registered" &&
                      activity.leavable && (
                        <button
                          className="px-4 py-2 text-white bg-[#0066B3] rounded hover:bg-[#005699]"
                          onClick={() => {}}
                        >
                          Rời hoạt động
                        </button>
                      )}
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </>
  );
};

export default PastActivityPage;
