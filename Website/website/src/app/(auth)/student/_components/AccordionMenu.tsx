// src/components/AccordionMenu.tsx
import React from 'react';
import { FaHome, FaBook, FaGraduationCap, FaMoneyBill, FaEllipsisH } from 'react-icons/fa';

const AccordionMenu: React.FC = () => {
    return (
        <nav className="bg-gray-100 w-64 p-4 space-y-2">
            <div className="flex items-center p-2 hover:bg-gray-200 rounded cursor-pointer">
                <FaHome className="mr-2" />
                <span>Trang chủ</span>
            </div>
            <div className="flex items-center p-2 hover:bg-gray-200 rounded cursor-pointer">
                <FaBook className="mr-2" />
                <span>Thông tin chung</span>
            </div>
            <div className="flex items-center p-2 hover:bg-gray-200 rounded cursor-pointer">
                <FaGraduationCap className="mr-2" />
                <span>Học tập</span>
            </div>
            <div className="flex items-center p-2 hover:bg-gray-200 rounded cursor-pointer">
                <FaMoneyBill className="mr-2" />
                <span>Học phí</span>
            </div>
            <div className="flex items-center p-2 hover:bg-gray-200 rounded cursor-pointer">
                <FaEllipsisH className="mr-2" />
                <span>Khác</span>
            </div>
        </nav>
    );
};

export default AccordionMenu;
