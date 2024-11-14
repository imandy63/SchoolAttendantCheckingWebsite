"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  useGetActivity,
  useGetActivityForStudent,
  useParticipateActivity,
} from "@/query/useActivity";

interface ActivityData {
  activity_categories: string[];
  activity_duration: number;
  activity_host: string;
  activity_max_participants: number;
  activity_name: string;
  activity_participants: any[];
  activity_point: number;
  activity_start_date: string;
  activity_status: string;
  activity_thumb_url: string | null;
  activity_total_participants: number;
  activity_location: string;
  participation_status: boolean;
}

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

  console.log(participatable);

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
    <div className="flex flex-col md:flex-row gap-6 p-8 max-w-6xl mx-auto">
      {/* Image Section */}
      <div className="flex-1">
        <img
          src={activity_thumb_url || "/images/placeholder-image.jpg"}
          alt={activity_name}
          className="w-full h-auto rounded-lg shadow-md"
        />
      </div>

      {/* Details Section */}
      <div className="flex-1 space-y-4">
        <h1 className="text-2xl font-bold">{activity_name}</h1>

        {/* Date & Location */}
        <div className="bg-gray-100 rounded-lg p-4 space-y-1">
          <p className="text-gray-700 font-semibold">{formattedDate}</p>
          <p className="text-gray-500">{formattedTime}</p>
          <p className="text-gray-500">{activity_location}</p>
        </div>

        {/* Seats Info */}
        <p className="text-gray-700 font-semibold">
          Còn lại: {remainingSeats} ghế trống
        </p>

        {/* Actions */}
        <div className="flex space-x-4">
          <button
            className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg"
            onClick={handleParticipation}
            disabled={
              !participatable || isSuccess || activity_status === "CLOSED"
            }
          >
            {isSuccess || !participatable ? "Đã đăng ký" : "Đăng ký tham gia"}
          </button>
          <button className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg">
            Chia sẻ với bạn
          </button>
        </div>

        {/* Display Success/Error Messages */}
        {isSuccess && <p className="text-green-500">Đăng ký thành công!</p>}
        {isError && (
          <p className="text-red-500">Đăng ký thất bại. Vui lòng thử lại.</p>
        )}

        {/* Activity Details */}
        <div className="mt-4 space-y-2">
          <p>
            <strong>Host:</strong> {activity_host}
          </p>
          <p>
            <strong>Duration:</strong> {activity_duration} minutes
          </p>
          <p>
            <strong>Points:</strong> {activity_point}
          </p>
          <p>
            <strong>Categories:</strong> {activity_categories.join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
