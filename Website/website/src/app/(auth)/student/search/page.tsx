"use client";
import { useSearchParams } from "next/navigation";
import styles from "../../../../components_style/SearchPage.module.css";
import { useGetActivityInfinite } from "@/query/useActivity"; // Ensure this uses useInfiniteQuery
import ActivityCard from "../_components/ActivityCard";
import { Notification } from "@/components/Notification";

const Search = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search")?.toLowerCase() || "";

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetActivityInfinite(search);

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };
  return (
    <div className={`${styles.webContainer} !px-20`}>
      <h1 className={styles.searchTitle}>Kết quả tìm kiếm: {search}</h1>

      {/* Display Activities */}
      <div className="flex gap-4">
        <div className={`${styles.eventsContainer} w-3/5`}>
          {data?.pages.map((page) => {
            console.log(page);
            return page.data.map((activity, index) => (
              <ActivityCard
                key={activity._id || index}
                activity_categories={activity.activity_categories}
                activity_host={activity.activity_host}
                activity_id={activity._id}
                activity_location={activity.activity_location}
                activity_max_participants={activity.activity_max_participants}
                activity_name={activity.activity_name}
                activity_start_date={activity.activity_start_date}
                activity_thumb_url={activity.activity_thumb_url}
                activity_total_participants={
                  activity.activity_participants_total
                }
                participation_status={activity.participation_status}
              />
            ));
          })}

          {hasNextPage && (
            <div className="flex justify-center mt-4">
              <button
                onClick={loadMore}
                disabled={isFetchingNextPage}
                className="text-blue-500 hover:underline"
              >
                {isFetchingNextPage ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
        <div className="w-2/5">
          <Notification className={""} />
        </div>
      </div>
    </div>
  );
};

export default Search;
