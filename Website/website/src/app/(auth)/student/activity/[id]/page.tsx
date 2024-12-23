"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faCalendarAlt,
  faClock,
  faUsers,
  faUser,
  faStar,
  faTag,
  faShareAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  useGetActivityForStudent,
  useParticipateActivity,
} from "@/query/useActivity";

const ActivityPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { id: activity_id } = params;

  const {
    data: activityData,
    isLoading,
    error,
  } = useGetActivityForStudent(activity_id as string);
  const { mutate, isSuccess, isError } = useParticipateActivity(
    activity_id as string
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) {
    router.push("/main");
  }
  if (!activityData) return <p>No data available</p>;

  const {
    activity_categories,
    activity_duration,
    activity_host,
    activity_max_participants,
    activity_name,
    activity_point,
    activity_start_date,
    activity_status,
    activity_thumb_url,
    activity_total_participants,
    activity_location,
    participatable,
  } = activityData;

  const remainingSeats =
    activity_max_participants - activity_total_participants;
  const formattedDate = format(
    new Date(activity_start_date),
    "EEEE, dd/MM/yyyy"
  );
  const formattedTime = format(new Date(activity_start_date), "h:mm a");

  const handleParticipation = () => {
    mutate();
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8 max-w-6xl mx-auto bg-white shadow-lg rounded-lg mt-6">
      {/* Image Section */}
      <div className="flex-1">
        <img
          src={activity_thumb_url || "/images/placeholder-image.jpg"}
          alt={activity_name}
          className="w-full h-96 object-cover rounded-lg shadow-md"
        />
      </div>

      {/* Details Section */}
      <div className="flex-1 space-y-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {activity_name}
        </h1>

        {/* Date, Time & Location */}
        <div className="bg-blue-100 rounded-lg p-6 space-y-2 shadow-md">
          <div className="flex items-center text-blue-800 space-x-2 text-lg">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-500" />
            <span className="font-semibold">{formattedDate}</span>
          </div>
          <div className="flex items-center text-blue-600 space-x-2 text-lg">
            <FontAwesomeIcon icon={faClock} className="text-blue-500" />
            <span>{formattedTime}</span>
          </div>
          <div className="flex items-center text-blue-600 space-x-2 text-lg">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-500" />
            <span>{activity_location}</span>
          </div>
        </div>

        {/* Seats Info */}
        <div className="flex items-center text-blue-700 font-semibold space-x-2 text-lg">
          <FontAwesomeIcon icon={faUsers} className="text-blue-500" />
          <span>Còn lại: {remainingSeats} ghế trống</span>
        </div>

        {/* Actions */}
        <div className="flex space-x-4">
          <button
            className={`${
              !participatable ||
              isSuccess ||
              activity_status === "CLOSED" ||
              activity_max_participants === activity_total_participants
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            } font-semibold py-3 px-8 rounded-full transition duration-300 shadow-md text-lg`}
            onClick={handleParticipation}
            disabled={
              !participatable ||
              isSuccess ||
              activity_status === "CLOSED" ||
              activity_max_participants === activity_total_participants
            }
          >
            {activity_status === "CLOSED"
              ? "Đã kết thúc"
              : isSuccess || !participatable
              ? "Đã đăng ký"
              : "Đăng ký tham gia"}
          </button>
          <button className="bg-gray-200 text-gray-800 font-semibold py-3 px-8 rounded-full hover:bg-gray-300 transition duration-300 shadow-md flex items-center space-x-2 text-lg">
            <FontAwesomeIcon icon={faShareAlt} />
            <span>Chia sẻ với bạn</span>
          </button>
        </div>

        {/* Display Success/Error Messages */}
        {isSuccess && (
          <p className="text-green-500 font-semibold">Đăng ký thành công!</p>
        )}
        {isError && (
          <p className="text-red-500 font-semibold">
            Đăng ký thất bại. Vui lòng thử lại.
          </p>
        )}

        {/* Activity Details */}
        <div className="bg-gray-50 rounded-lg p-6 shadow-sm space-y-4">
          <div className="flex items-center text-gray-700 space-x-3 text-lg">
            <FontAwesomeIcon icon={faUser} className="text-blue-500" />
            <span>
              <strong>Người tổ chức:</strong> {activity_host}
            </span>
          </div>
          <div className="flex items-center text-gray-700 space-x-3 text-lg">
            <FontAwesomeIcon icon={faClock} className="text-blue-500" />
            <span>
              <strong>Thời gian:</strong> {activity_duration} phút
            </span>
          </div>
          <div className="flex items-center text-gray-700 space-x-3 text-lg">
            <FontAwesomeIcon icon={faStar} className="text-blue-500" />
            <span>
              <strong>Điểm tích lũy:</strong> {activity_point}
            </span>
          </div>
          <div className="flex items-center text-gray-700 space-x-3 text-lg">
            <FontAwesomeIcon icon={faTag} className="text-blue-500" />
            <span>
              <strong>Danh mục:</strong> {activity_categories.join(", ")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
