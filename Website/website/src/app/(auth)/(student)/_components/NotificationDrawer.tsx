import React, { useEffect, useState } from "react";
import {
  useGetNotifications,
  useReadAllNotification,
  useReadNotification,
} from "@/query/useNotification";
import { useNotification } from "@/context/FCMContext";

interface NotificationsDrawerProps {
  isOpen: boolean;
  readAllAvailagble: boolean;
  onClose: () => void;
}

const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  readAllAvailagble,
  onClose,
}) => {
  const { payload } = useNotification();
  const {
    data: notifications,
    refetch,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useGetNotifications(1);

  const { mutate: readAll } = useReadAllNotification();
  const { mutate: readNotification } = useReadNotification();

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch, payload]);

  const loadMore = () => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-5 bg-white shadow-lg rounded-lg w-[400px] p-4 z-50">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Thông báo</h2>
        {readAllAvailagble && (
          <button
            onClick={() => {
              readAll();
            }}
            className="text-blue-500"
          >
            Đánh dấu đã đọc tất cả
          </button>
        )}
      </div>

      <div className="overflow-y-auto overflow-x-hidden max-h-64">
        {notifications?.pages?.map((page, index) => {
          return (
            <>
              {page?.data.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => readNotification(notification.id)}
                  className={`border-b rounded cursor-pointer p-2 ${
                    notification.notification_status === "SENT"
                      ? "bg-green-100 hover:bg-green-200"
                      : ""
                  }`}
                >
                  <h3 className="font-semibold pb-3 break-words">
                    {notification.notification_title}
                  </h3>
                  <p className="text-base">
                    {notification.notification_details}
                  </p>
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-gray-500 text-xs">
                      {new Date(
                        notification.notification_send_time
                      ).toLocaleString()}
                    </div>
                    <div
                      className={`inline-block ml-2 p-1 h-1 w-1 text-sm rounded-full ${
                        notification.notification_status === "SENT"
                          ? "bg-green-400"
                          : ""
                      }`}
                    />
                  </div>
                </div>
              ))}
            </>
          );
        })}
      </div>

      {hasNextPage && (
        <div className="flex justify-center mt-4">
          <button
            onClick={loadMore}
            disabled={isFetching}
            className="text-blue-500 hover:underline"
          >
            {isFetching ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationsDrawer;
