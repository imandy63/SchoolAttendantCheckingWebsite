import { useEffect } from "react";
import ActivityCard from "./ActivityCard";
import { useGetActivitiesByDate } from "@/query/useActivity";
import { useNotification } from "@/context/FCMContext";

interface EventDetailsProps {
  selectedDate: string;
}

const EventDetails: React.FC<EventDetailsProps> = ({ selectedDate }) => {
  const activitiesByDate = useGetActivitiesByDate(selectedDate);
  const { payload } = useNotification();

  useEffect(() => {
    activitiesByDate.refetch();
  }, [payload]);

  return (
    <div className="w-full lg:w-2/3 p-4">
      <h2 className="text-2xl font-semibold mb-4">
        Hoạt động vào ngày {selectedDate}
      </h2>
      {activitiesByDate.isLoading ? (
        <p>Đang tải...</p>
      ) : activitiesByDate.data.length > 0 ? (
        activitiesByDate.data.map((activity: any) => (
          <ActivityCard
            activity_location={activity.activity_location}
            key={activity._id}
            activity_id={activity._id}
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
