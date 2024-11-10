import { useEffect } from "react";
import ActivityCard from "./ActivityCard";

interface EventDetailsProps {
  selectedDate: Date;
  activitiesByDate: any;
}

const EventDetails: React.FC<EventDetailsProps> = ({
  selectedDate,
  activitiesByDate,
}) => {
  useEffect(() => {
    if (activitiesByDate.isLoading) {
      // Handle loading state
    }
  }, [activitiesByDate.isLoading]);

  console.log(activitiesByDate.data);

  return (
    <div className="w-full lg:w-2/3 p-4">
      <h2 className="text-2xl font-semibold mb-4">
        Hoạt động vào ngày {selectedDate.toLocaleDateString("vi-VN")}
      </h2>
      {activitiesByDate.isLoading ? (
        <p>Đang tải...</p>
      ) : activitiesByDate.data.length > 0 ? (
        activitiesByDate.data.map((activity: any) => (
          <ActivityCard
            activity_location={activity.activity_location}
            activity_id={activity._id}
            key={activity._id}
            activity_categories={activity.activity_categories}
            activity_max_participants={activity.activity_max_participants}
            activity_name={activity.activity_name}
            activity_start_date={activity.activity_start_date}
            activity_thumb_url={activity.activity_thumb_url}
            activity_host={activity.activity_host}
            activity_total_participants={activity.activity_total_participants}
            participation_status={activity.participation_status}
          />
        ))
      ) : (
        <p className="text-gray-500">Không có hoạt động nào trong ngày này.</p>
      )}
    </div>
  );
};

export default EventDetails;
