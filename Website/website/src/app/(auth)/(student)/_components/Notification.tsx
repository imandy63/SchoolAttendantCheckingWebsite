import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchUnreadCount = async () => {
  const response = await axios.get("/notification/unread-count");
  return response.data;
};

const fetchNotifications = async () => {
  const response = await axios.get("/notification/messages");
  return response.data;
};

const NotificationComponent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Fetch unread count
  const { data: unreadCount } = useQuery(["unreadCount"], fetchUnreadCount);

  // Fetch notifications when the component is opened
  const { data: notifications, refetch } = useQuery(
    ["notifications"],
    fetchNotifications,
    {
      enabled: false, // disable automatic fetching
    }
  );

  // Open notification panel and fetch notifications
  const handleOpen = () => {
    setIsOpen(true);
    refetch();
  };

  // Close notification panel
  const handleClose = () => setIsOpen(false);

  return (
    <div className="relative">
      {/* Bell Icon with unread count */}
      <div className="flex items-center cursor-pointer" onClick={handleOpen}>
        <div className="relative">
          <span className="bell-icon">🔔</span>
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-green-500 text-white rounded-full px-2 text-xs">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-10 bg-white shadow-lg rounded-lg w-80 p-4 z-50">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Thông báo</h2>
            <button onClick={handleClose}>Đánh dấu là đã đọc</button>
          </div>
          <div className="overflow-y-auto max-h-64">
            {notifications?.map((notification: any, index: number) => (
              <div key={index} className="border-b py-2 last:border-none">
                <h3 className="font-semibold">{notification.title}</h3>
                <p>{notification.message}</p>
                <span className="text-gray-500 text-sm">
                  {notification.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationComponent;
