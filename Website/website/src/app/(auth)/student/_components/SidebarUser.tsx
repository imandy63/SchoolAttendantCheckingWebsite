"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faTasks, faBars } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`fixed z-10 top-20 bg-gray-100 shadow-lg overflow-hidden ${
        isCollapsed ? "w-12 h-12" : "w-64 h-screen"
      } duration-300 flex flex-col items-center`}
      style={{ transition: "width 0.3s, height 0.3s" }}
    >
      {/* Nút toggle */}
      <button onClick={toggleSidebar} className="mt-2 mb-6">
        <FontAwesomeIcon icon={faBars} className="text-gray-700" />
      </button>

      {/* Kiểm tra trạng thái isCollapsed để hiển thị hoặc ẩn các mục */}
      {!isCollapsed && (
        <div className="w-full">
          <Link href="/student/info">
            <div className="flex items-center space-x-4 p-4 hover:bg-gray-200 rounded-lg cursor-pointer">
              <FontAwesomeIcon icon={faUser} className="text-gray-700" />
              <span className="text-gray-700 font-medium">
                Thông tin sinh viên
              </span>
            </div>
          </Link>
          <Link href="/student/activity">
            <div className="flex items-center space-x-4 p-4 hover:bg-gray-200 rounded-lg cursor-pointer">
              <FontAwesomeIcon icon={faTasks} className="text-gray-700" />
              <span className="text-gray-700 font-medium">Hoạt động</span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
