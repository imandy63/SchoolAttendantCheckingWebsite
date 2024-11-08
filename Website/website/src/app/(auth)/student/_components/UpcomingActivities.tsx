import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faShareAlt,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";

interface UpcomingActivitiesProps {
  upcomingActivities: any;
  loadMoreRef: React.RefObject<HTMLDivElement>;
}

const UpcomingActivities: React.FC<UpcomingActivitiesProps> = ({
  upcomingActivities,
  loadMoreRef,
}) => {
  return (
    <div className="w-full lg:w-2/3 p-4 overflow-y-auto h-screen">
      <h2 className="text-2xl font-semibold mb-6">Hoạt động sắp tới</h2>
      {upcomingActivities.isLoading ? (
        <p className="text-gray-500">Đang tải hoạt động...</p>
      ) : upcomingActivities.data.pages &&
        upcomingActivities.data.pages.length > 0 ? (
        upcomingActivities.data.pages.map((page, pageIndex) =>
          page.map((eventGroup, groupIndex) => (
            <div key={groupIndex} className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-blue-600">
                {eventGroup._id}
              </h3>
              {eventGroup.activities.map((activity, activityIndex) => (
                <div
                  key={activityIndex}
                  className="border-b border-gray-300 pb-6 mb-6 flex items-start gap-4"
                >
                  <img
                    src={
                      activity.activity_thumb_url ||
                      "/path/to/default-image.jpg"
                    }
                    alt={activity.activity_name}
                    className="w-20 h-20 rounded"
                  />
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold">
                      {activity.activity_name}
                    </h4>
                    <p className="text-gray-500">
                      {activity.activity_host} -{" "}
                      {new Date(
                        activity.activity_start_date
                      ).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-gray-500">
                      {activity.activity_description}
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    {activity.is_registered ? (
                      <span className="text-green-600">
                        <FontAwesomeIcon icon={faCheckCircle} /> Đã đăng ký
                      </span>
                    ) : (
                      <>
                        <button className="text-gray-500 hover:text-gray-700">
                          <FontAwesomeIcon icon={faShareAlt} />
                        </button>
                        <button className="text-gray-500 hover:text-gray-700">
                          <FontAwesomeIcon icon={faCopy} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {eventGroup.activities.length >= 10 && <div ref={loadMoreRef} />}
            </div>
          ))
        )
      ) : (
        <p className="text-gray-500">Không có hoạt động nào sắp tới.</p>
      )}
    </div>
  );
};

export default UpcomingActivities;
