// src/components/StudentInfo.tsx
import React from 'react';
import Image from 'next/image';
const StudentInfo: React.FC = () => {
    return (
        <div className="p-6">
            <div className="flex items-center mb-4">
                <Image src="" alt="Student Avatar" className="w-20 h-20 rounded-full mr-4" />
                <div>
                    <p><strong>MSSV:</strong> 2001215828</p>
                    <p><strong>Họ tên:</strong> Phạm Hồ Đăng Huy</p>
                    <p><strong>Giới tính:</strong> Nam</p>
                </div>
            </div>
            <h2 className="text-xl font-bold mb-2">Thông tin học vấn</h2>
            <div className="grid grid-cols-2 gap-4">
                <p><strong>Trạng thái:</strong> Đang học</p>
                <p><strong>Mã hồ sơ:</strong> 2001215828</p>
                <p><strong>Lớp học:</strong> 12DHTH01</p>
                <p><strong>Ngày vào trường:</strong> 18/9/2021</p>
                <p><strong>Bậc đào tạo:</strong> Đại học</p>
                <p><strong>Cơ sở:</strong> CNTP TP.HCM</p>
                <p><strong>Khoa:</strong> Khoa Công nghệ Thông tin</p>
                <p><strong>Loại hình đào tạo:</strong> Chính quy</p>
                <p><strong>Chuyên ngành:</strong> Công nghệ phần mềm</p>
                <p><strong>Khóa học:</strong> 2021</p>
            </div>
        </div>
    );
};

export default StudentInfo;
