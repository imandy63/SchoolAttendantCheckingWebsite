import React from 'react';

const StudentInfo: React.FC = () => {
    return (
        <div className="flex items-start p-6 ml-10 bg-white rounded-lg shadow-lg">
            <div className="flex-shrink-0 mr-10">
                {/* Avatar */}
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500">Avatar</span>
                </div>
                <div className="mt-4">
                    <p><strong>MSSV:</strong> 2001215828</p>
                    <p><strong>Họ tên:</strong> Phạm Hồ Đăng Huy</p>
                    <p><strong>Giới tính:</strong> Nam</p>
                </div>
            </div>
            <div className="flex-grow ml-10"> {/* Thêm ml-10 để tạo khoảng cách */}
                <h2 className="text-xl font-bold mb-4">Thông tin học vấn</h2>
                <hr className="border-t border-gray-300 mb-4"/> {/* Dấu gạch ngang phân chia */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
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
        </div>
    );
};

export default StudentInfo;
