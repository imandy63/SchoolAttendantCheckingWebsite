"use client";
import { useSearchParams } from "next/navigation";
import styles from "../../../../components_style/SearchPage.module.css";
import { useGetActivityInfinite } from "@/query/useActivity"; // Ensure this uses useInfiniteQuery
import ActivityCard from "../_components/ActivityCard";
import { Notification } from "@/components/Notification";
import { useState, useEffect } from "react";

const Search = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search")?.toLowerCase() || "";

  const [filter, setFilter] = useState("all");

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetActivityInfinite(
    search,
    filter === "all" ? null : filter === "ended"
  );

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
    refetch(); // Trigger refetch on filter change
    window.scrollTo(0, 0); // Scroll to top
  };

  useEffect(() => {
    refetch(); // Ensure data is refetched on initial load or when filter changes
  }, [filter]);

  return (
    <div className={`${styles.webContainer} !px-20`}>
      <h1 className={styles.searchTitle}>Kết quả tìm kiếm: {search}</h1>

      {/* Filters */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <label className="mr-2">Lọc theo:</label>
          <select
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="all">Tất cả</option>
            <option value="upcoming">Sắp tới</option>
            <option value="ended">Đã kết thúc</option>
          </select>
        </div>
      </div>

      {/* Display Activities */}
      <div className="flex gap-4">
        <div className={`${styles.eventsContainer} w-3/5`}>
          {data?.pages.map((page) => {
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
