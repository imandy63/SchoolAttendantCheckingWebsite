import { useGetUnreadCount } from "@/query/useNotification";
import React, { useEffect, useState } from "react";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NotificationsDrawer from "./NotificationDrawer";
import { useNotification } from "@/context/FCMContext";

const NotificationBell = () => {
  const { data, refetch } = useGetUnreadCount();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { payload } = useNotification();
  useEffect(() => {
    refetch();
  }, [payload]);

  return (
    <div className="flex items-center cursor-pointer relative">
      <div className="relative">
        <FontAwesomeIcon
          icon={faBell}
          className="bell-icon"
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        />
        {data && data.total > 0 && (
          <div className="absolute -top-4 -right-4 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[0.6rem]">
            {data.total < 100 ? data.total : "99+"}
          </div>
        )}
        <NotificationsDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          readAllAvailagble={data?.total > 0}
        />
      </div>
    </div>
  );
};

export default NotificationBell;
