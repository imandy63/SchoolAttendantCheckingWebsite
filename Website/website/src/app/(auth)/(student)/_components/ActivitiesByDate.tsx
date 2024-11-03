interface EventDetailsProps {
  selectedDate: Date;
  activitiesByDate: any;
}

const EventDetails: React.FC<EventDetailsProps> = ({
  selectedDate,
  activitiesByDate,
}) => {
  if (activitiesByDate.isLoading) return <p>Đang tải...</p>;

  console.log(activitiesByDate);
  return (
    <div className="w-full lg:w-2/3 p-4">
      <h2 className="text-2xl font-semibold mb-4">
        Hoạt động vào ngày {selectedDate.toLocaleDateString("vi-VN")}
      </h2>
      {activitiesByDate.isLoading ? (
        <p>Đang tải...</p>
      ) : activitiesByDate.data && activitiesByDate.data.length > 0 ? (
        activitiesByDate.data.map((activity: any) => (
          <div
            key={activity.activityId}
            className="border-b border-gray-300 pb-6 mb-6"
          >
            <h4 className="text-xl font-semibold">{activity.activity_name}</h4>
            <p className="text-gray-500">{activity.activity_description}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Không có hoạt động nào trong ngày này.</p>
      )}
    </div>
  );
};

export default EventDetails;
