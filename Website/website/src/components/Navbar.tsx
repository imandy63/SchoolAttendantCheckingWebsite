"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faTimes,
  faBars,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NotificationBell from "@/app/(auth)/student/_components/NotificationBell";
import Image from "next/image";
import { useStudentInfoContext } from "@/context/StudentAuthContext";
import { isUnionWorker, logoutUser } from "@/api/api.auth";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unionWorker, setUnionWorker] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/student/search?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    const checkUnionWorker = async () => {
      const isUW = (await isUnionWorker()).status;
      setUnionWorker(isUW);
    };

    checkUnionWorker();
  }, []);

  const { data, isLoading } = useStudentInfoContext();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-[#0066B3] text-white py-3">
      <nav className="flex justify-between items-center w-[90%] mx-auto">
        {/* Logo */}
        <div className="flex items-center mr-6">
          <img
            src="https://cep.huit.edu.vn/app_web/tttnth/images/icons/logo-huit-trang.png"
            alt="Logo"
            className="h-auto w-28 md:w-36 lg:w-44"
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Navigation Links */}
        <div
          className={`hidden md:flex space-x-8 mr-8 ${
            isMenuOpen ? "flex" : "hidden"
          } md:flex`}
        >
          <Link href="/student/main" className="hover:text-gray-200">
            Trang chủ
          </Link>
          <Link href="/student/posts" className="hover:text-gray-200">
            Bài viết
          </Link>
          {unionWorker && (
            <Link href="/union-worker" className="hover:text-gray-200">
              Vào trang điểm danh
            </Link>
          )}
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="relative hidden md:flex items-center mr-8"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm..."
            className="p-2 pl-4 rounded-full bg-white text-black focus:outline-none w-64 border border-gray-300"
          />
          <button type="submit" className="absolute right-3 text-black">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </form>

        {/* User Actions */}
        <div className="relative flex items-center space-x-4">
          <Link href="/student/past-activities" className="hover:text-gray-200">
            Hoạt động của bạn
          </Link>
          <NotificationBell />

          {/* User Profile Dropdown */}
          <div className="relative">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={toggleDropdown}
            >
              {isLoading ? (
                <>
                  <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                  <div className="hidden md:inline w-24 h-5 bg-gray-300 rounded-md"></div>
                </>
              ) : (
                <>
                  <Image
                    src={
                      data.student_avatar_url
                        ? data.student_avatar_url
                        : "/default-avatar.jpg"
                    }
                    alt="User Avatar"
                    className="rounded-full"
                    width={40}
                    height={40}
                  />
                  <span className="hidden md:inline">{data?.student_name}</span>
                </>
              )}

              <FontAwesomeIcon icon={faChevronDown} />
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 text-black">
                <Link
                  onClick={() => setIsDropdownOpen(false)}
                  href="/student/info"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Thông tin tài khoản
                </Link>
                <button
                  onClick={async () => {
                    await logoutUser();
                    setIsDropdownOpen(false);
                    router.push("/login");
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={toggleMenu}
          className="text-3xl cursor-pointer md:hidden ml-4"
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
              className="absolute right-2 text-black"
            >
              <FontAwesomeIcon
                icon={faSearch}
                className="bg-white rounded-full p-1"
              />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
