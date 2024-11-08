// MainHeader.tsx
'use client';
import React, { useState } from 'react';
import styles from '../components_style/MainHeader.module.css';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBell, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
/*import Image from 'next/image';*/

const MainHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); // State để lưu từ khóa tìm kiếm
    const router = useRouter();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleSearch = (e: React.FormEvent | React.MouseEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?query=${encodeURIComponent(searchQuery)}`); // Điều hướng đến trang tìm kiếm
        }
    };

    return (
        <header className="bg-white border">
            <nav className="flex justify-between items-center w-[92%] mx-auto p-4">
                <div>
                    {/* <Image
                        className="w-16 cursor-pointer"
                        src="https://cdn-icons-png.flaticon.com/512/5968/5968204.png"
                        alt="Logo"
                    /> */}
                </div>

                <div className={clsx(
                    "nav-links bg-white duration-500 absolute md:min-h-fit min-h-[60vh] left-0 top-[-100%] md:static md:w-auto w-full flex items-center px-5 md:top-0",
                    isMenuOpen ? "top-[0%]" : "top-[-100%]",
                    styles['navbar']
                )}>
                    <ul className="flex text-center md:flex-row flex-col md:items-center md:gap-[4vw] gap-8">
                        <li>
                            <a className="hover:text-gray-500" href="#">Trang chủ</a>
                        </li>
                        <li>
                            <a className="hover:text-gray-500" href="#">Bài viết</a>
                        </li>
                    </ul>
                    <div className="relative hidden md:flex items-center">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                            placeholder="Tìm kiếm..."
                            className={clsx(
                                "w-full p-2 pl-4 rounded-full border border-gray-300 focus:outline-none",
                                styles['search-bar']
                            )}
                        />
                        <button onClick={handleSearch} className="absolute right-2 text-white">
                            <FontAwesomeIcon icon={faSearch} className="bg-black rounded-full p-1" />
                        </button>
                    </div>
                    <div className="flex space-x-4 items-center">
                        <a href="#" className="text-black font-medium hover:underline">Hoạt động của bạn</a>
                        <button className="bg-white p-2 rounded-full">
                            <FontAwesomeIcon icon={faBell} className="text-gray-500 h-5 w-5" />
                        </button>
                        <div className="bg-white w-8 h-8 rounded-full border border-black"></div>
                        <span className="text-black font-medium">Kong Hoa Hung</span>
                    </div>
                </div>
                <button onClick={toggleMenu} className={clsx(
                    "text-3xl cursor-pointer md:hidden",
                    styles['z-998']
                )}>
                    <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
                </button>
            </nav>

            {/* Search Bar for Mobile */}
            {isMenuOpen && (
                <div className="flex md:hidden relative items-center justify-center p-4">
                    <div className="absolute top w-4/5 rounded-full border border-gray-300 flex items-center">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                            placeholder="Tìm kiếm..."
                            className="w-full p-2 pl-4 focus:outline-none"
                        />
                        <button onClick={handleSearch} className="absolute right-2 text-white">
                            <FontAwesomeIcon icon={faSearch} className="bg-black rounded-full p-1" />
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default MainHeader;