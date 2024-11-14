import { useGetUpcomingActivitiesGroupByDate } from "@/query/useActivity";
import ActivityCard from "./ActivityCard";
import { useEffect, useRef } from "react";
import { useNotification } from "@/context/FCMContext";

const UpcomingActivities = () => {
  const upcomingActivities = useGetUpcomingActivitiesGroupByDate();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const { payload } = useNotification();

  useEffect(() => {
    upcomingActivities.refetch();
  }, [payload]);

  useEffect(() => {
    if (
      !loadMoreRef.current ||
      upcomingActivities.isFetchingNextPage ||
      !upcomingActivities.hasNextPage
    )
      return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        upcomingActivities.fetchNextPage();
      }
    });

    observer.observe(loadMoreRef.current);
    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, []);

  return (
    <div className="w-full lg:w-2/3 p-4 overflow-y-auto h-screen">
      <h2 className="text-2xl font-semibold mb-6">Hoạt động sắp tới</h2>
      {upcomingActivities.data && (
        <>
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
                    <ActivityCard
                      activity_location={activity.activity_location}
                      key={activity._id}
                      activity_id={activity._id}
                      activity_categories={activity.activity_categories}
                      activity_max_participants={
                        activity.activity_max_participants
                      }
                      activity_name={activity.activity_name}
                      activity_start_date={activity.activity_start_date}
                      activity_thumb_url={activity.activity_thumb_url}
                      activity_host={activity.activity_host}
                      activity_total_participants={
                        activity.activity_total_participants
                      }
                      participation_status={activity.participation_status}
                    />
                  ))}
                  {eventGroup.activities.length >= 10 && (
                    <div ref={loadMoreRef} />
                  )}
                </div>
              ))
            )
          ) : (
            <p className="text-gray-500">Không có hoạt động nào sắp tới.</p>
          )}{" "}
        </>
      )}
    </div>
  );
};

export default UpcomingActivities;
