// MainHeader.tsx
"use client";
import React, { useState } from "react";
import styles from "../../../../components_style/MainHeader.module.css";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NotificationBell from "./NotificationBell";

const MainHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State để lưu từ khóa tìm kiếm
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/activity?search=${encodeURIComponent(searchQuery)}`); // Điều hướng đến trang tìm kiếm
    }
  };

  return (
    <header className="bg-white border">
      <nav className="flex justify-between items-center w-[92%] mx-auto p-4">
        <div>
          <img
            className="w-16 cursor-pointer"
            src="https://cdn-icons-png.flaticon.com/512/5968/5968204.png"
            alt="Logo"
          />
        </div>

        <div
          className={clsx(
            "nav-links bg-white duration-500 absolute md:min-h-fit min-h-[60vh] left-0 top-[-100%] md:static md:w-auto w-full flex items-center px-5 md:top-0",
            isMenuOpen ? "top-[0%]" : "top-[-100%]",
            styles["navbar"]
          )}
        >
          <ul className="flex text-center md:flex-row flex-col md:items-center md:gap-[4vw] gap-8">
            <li>
              <Link className="hover:text-gray-500" href="/main">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link className="hover:text-gray-500" href="#">
                Bài viết
              </Link>
            </li>
          </ul>
          <div className="relative hidden md:flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
              placeholder="Tìm kiếm..."
              className={clsx(
                "w-full p-2 pl-4 rounded-full border border-gray-300 focus:outline-none",
                styles["search-bar"]
              )}
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 text-white"
            >
              <FontAwesomeIcon
                icon={faSearch}
                className="bg-black rounded-full p-1"
              />
            </button>
          </div>
          <div className="flex space-x-4 items-center">
            <Link href="#" className="text-black font-medium hover:underline">
              Hoạt động của bạn
            </Link>
            <NotificationBell />
            <div className="bg-white w-8 h-8 rounded-full border border-black"></div>
            <span className="text-black font-medium">Kong Hoa Hung</span>
          </div>
        </div>

        <button
          onClick={toggleMenu}
          className={clsx("text-3xl cursor-pointer md:hidden", styles["z-998"])}
        >
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
        </button>
      </nav>

      {/* Mobile Search Bar */}
      {isMenuOpen && (
        <div className="flex md:hidden relative items-center justify-center p-4">
          <div className="absolute top w-4/5 rounded-full border border-gray-300 flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
              placeholder="Tìm kiếm..."
              className="w-full p-2 pl-4 focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 text-white"
            >
              <FontAwesomeIcon
                icon={faSearch}
                className="bg-black rounded-full p-1"
              />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default MainHeader;
